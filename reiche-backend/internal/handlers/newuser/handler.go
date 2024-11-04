package newuser

import (
	"errors"
	"log"
	"net/http"
	"stiller"
	"stiller/internal/db"
	"stiller/internal/handlers/handleutils"

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

func scalarFn(ctx sqlite.Context, args []sqlite.Value) (sqlite.Value, error){
    db_conn := ctx.Conn()

    if len(args) != 5 {
        return sqlite.Value{}, ErrNotEnoughArgs
    }

    passwdbytes := []byte(args[4].Text())
    bcrypt_pwd, bcrypt_err := bcrypt.GenerateFromPassword(passwdbytes, stiller.StillerConfig.BCryptCost)
    if bcrypt_err != nil {
        return sqlite.Value{}, bcrypt_err
    }

    new_user := db.StillerUser{
        AvatarId:    args[0].Int(),
        TierId:      args[1].Int(),
        Username:    args[2].Text(),
        Displayname: args[2].Text(),
        Mail:        args[3].Text(),
        Bpasswd:     string(bcrypt_pwd),
    }

    query := `insert into user (avatar, tier, displayname, username, mail, bpasswd)
        values
            (?1, ?2, ?3, ?4, ?5, ?6)
        returning
            id;`

    new_id := int(-1)
    sqlitex.ExecuteTransient(db_conn, query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_id = stmt.ColumnInt(0)
            return nil
        },

        Args: []any{
            new_user.AvatarId,
            new_user.TierId,
            new_user.Username,
            new_user.Displayname,
            new_user.Mail,
            new_user.Bpasswd,
        },
    })

    if new_id == -1 {
        return sqlite.Value{}, ErrInQuery
    }

    return sqlite.IntegerValue(int64(new_id)), nil
}

func Nethandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    type ReqPayload struct {
        AvatarId    int    `json:"avatar_id"`
        TierId      int    `json:"tier_id"`
        Username    string `json:"username"`
        Mail        string `json:"mail"`
        Passwd      string `json:"pwd"`
    }

    type ResPayload struct {
        NewId int `json:"newid"`
    }

    rpayload := ReqPayload{}
    unmarshal_err := jsonexp.UnmarshalRead(r.Body, &rpayload, jsonexp.DefaultOptionsV2())
    if handleutils.RequestLog(unmarshal_err, "", http.StatusBadRequest, &w) {
        return
    }

    new_dbconn, dbconn_err := sqlite.OpenConn(stiller.StillerConfig.DBPath)
    if handleutils.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    create_fn_err := new_dbconn.CreateFunction("newuser", &sqlite.FunctionImpl{
        NArgs: 5,
        Deterministic: true,
        Scalar: scalarFn,
    })

    if create_fn_err != nil {
        log.Println(create_fn_err)
        return
    }

    defer new_dbconn.Close()

    query := `select newuser(?1, ?2, ?3, ?4, ?5);`

    new_id := int(-1)
    sqlitex.ExecuteTransient(new_dbconn, query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_id = stmt.ColumnInt(0)
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

    if new_id == -1 {
        handleutils.GenericLog(nil, "no new user was created")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    respayload := ResPayload{
        NewId: new_id,
    }

    w.WriteHeader(http.StatusOK)
    jsonexp.MarshalWrite(w, respayload, jsonexp.DefaultOptionsV2())
}




