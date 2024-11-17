package newuser

import (
	"errors"
	"net/http"
	"os"
	"stiller"
	"stiller/internal/dbutils"
	"stiller/internal/handlers/handleutils"
	"stiller/internal/jwtutils"
	"strconv"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"golang.org/x/crypto/bcrypt"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

var (
    ErrInQuery = errors.New("query error")
    ErrNotEnoughArgs = errors.New("not enough args in query")
)

func newuserScalarFn(ctx sqlite.Context, args []sqlite.Value) (sqlite.Value, error){
    db_conn := ctx.Conn()

    if len(args) != 5 {
        return sqlite.Value{}, ErrNotEnoughArgs
    }

    passwdbytes := []byte(args[4].Text())
    bcrypt_pwd, bcrypt_err := bcrypt.GenerateFromPassword(passwdbytes, stiller.StillerConfig.BCryptCost)
    if bcrypt_err != nil {
        return sqlite.Value{}, bcrypt_err
    }

    new_user := dbutils.StillerUser{
        TierId:      args[0].Int(),
        Username:    args[1].Text(),
        Displayname: args[2].Text(),
        Mail:        args[3].Text(),
        Bpasswd:     string(bcrypt_pwd),
    }

    query := `
        insert into
            user (tier, displayname, username, mail, bpasswd)
        values
            (?1, ?2, ?3, ?4, ?5)
        returning
            id;`

    new_id := int(-1)
    exec_err := sqlitex.ExecuteTransient(db_conn, query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_id = stmt.ColumnInt(0)
            return nil
        },

        Args: []any{
            new_user.TierId,
            new_user.Username,
            new_user.Displayname,
            new_user.Mail,
            new_user.Bpasswd,
        },
    })

    if exec_err != nil {
        return sqlite.Value{}, exec_err
    }

    if new_id == -1 {
        return sqlite.Value{}, ErrInQuery
    }

    return sqlite.IntegerValue(int64(new_id)), nil
}

func Nethandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    if handleutils.CORS(w, r) {
        return
    }

    type ReqPayload struct {
        AvatarId    int    `json:"avatar_id"`
        TierId      int    `json:"tier_id"`
        Username    string `json:"username"`
        Mail        string `json:"mail"`
        Passwd      string `json:"pwd"`
    }

    rpayload := ReqPayload{}
    unmarshal_err := jsonexp.UnmarshalRead(r.Body, &rpayload, jsonexp.DefaultOptionsV2())
    if handleutils.RequestLog(unmarshal_err, "", http.StatusBadRequest, &w) {
        return
    }

    new_dbconn, dbconn_err := dbutils.NewConn()
    if handleutils.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(new_dbconn)

    create_fn_err := new_dbconn.CreateFunction("newuser", &sqlite.FunctionImpl{
        NArgs: 5,
        Deterministic: true,
        Scalar: newuserScalarFn,
    })

    if handleutils.RequestLog(create_fn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    new_tk := jwtutils.Token{
        UserId: -1,
    }

    query := `select newuser(?1, ?2, ?3, ?4, ?5);`
    exec_err := sqlitex.ExecuteTransient(new_dbconn, query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_tk.UserId = stmt.ColumnInt(0)
            return nil
        },

        Args: []any{
            rpayload.AvatarId,
            rpayload.TierId,
            rpayload.Username,
            rpayload.Mail,
            rpayload.Passwd,
        },
    })

    if handleutils.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if new_tk.UserId == -1 {
        handleutils.GenericLog(nil, "no new user was created")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    new_dir := strconv.Itoa(new_tk.UserId)
    mkdir_err := os.MkdirAll(stiller.StillerConfig.FilesPath + new_dir, os.ModePerm)
    if handleutils.RequestLog(mkdir_err, "", http.StatusInternalServerError, &w) {
        return
    }

    sign_encoded, sign_err := new_tk.Encode()
    if handleutils.RequestLog(sign_err, "", http.StatusInternalServerError, &w) {
        return
    }

    w.WriteHeader(http.StatusOK)
    w.Write(sign_encoded)
}




