package handlers

import (
	"errors"
	"net/http"
	"os"
	"stiller"
	"stiller/pkg/dbutils"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"
	"strconv"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"golang.org/x/crypto/bcrypt"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

var (
    ErrInQuery = errors.New("query error")
    ErrNotEnoughArgs = errors.New("not enough args in query")
    ErrUserExists = errors.New("user already exists")
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
        TierId:      dbutils.StillerTier(args[0].Int()),
        Username:    args[1].Text(),
        Displayname: args[2].Text(),
        Mail:        args[3].Text(),
        Bpasswd:     string(bcrypt_pwd),
    }

    check_stmt := sqlf.
        Select("id").
        From("user").
        Where("username = ?", new_user.Username)

    defer check_stmt.Close()

    check_id := int(-1)
    check_err := sqlitex.ExecuteTransient(db_conn, check_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            check_id++
            return nil
        },

        Args: check_stmt.Args(),
    })

    if check_err != nil {
        return sqlite.Value{}, check_err
    }

    if check_id != -1 {
        return sqlite.IntegerValue(-1), ErrUserExists
    }

    query_stmt := sqlf.
        InsertInto("user").
            Set("tier", new_user.TierId).
            Set("displayname", new_user.Displayname).
            Set("username", new_user.Username).
            Set("mail", new_user.Mail).
            Set("bpasswd", new_user.Bpasswd).
        Returning("id")

    defer query_stmt.Close()

    query := query_stmt.String()
    new_id := int(-1)
    exec_err := sqlitex.ExecuteTransient(db_conn, query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_id = stmt.ColumnInt(0)
            return nil
        },

        Args: query_stmt.Args(),
    })

    if exec_err != nil {
        return sqlite.Value{}, exec_err
    }

    return sqlite.IntegerValue(int64(new_id)), nil
}

func PostAuthNewuser(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    type ReqPayload struct {
        AvatarId    int    `json:"avatar_id"`
        TierId      int    `json:"tier_id"`
        Username    string `json:"username"`
        Mail        string `json:"mail"`
        Passwd      string `json:"pwd"`
    }

    type ResPayload struct {
        Token    string              `json:"token"`
        UserData dbutils.StillerUser `json:"userdata"`
    }

    req_payload := ReqPayload{}
    res_payload := ResPayload{}

    unmarshal_err := jsonexp.UnmarshalRead(r.Body, &req_payload, jsonexp.DefaultOptionsV2())
    if loggers.RequestLog(unmarshal_err, "", http.StatusBadRequest, &w) {
        return
    }

    new_dbconn, dbconn_err := dbutils.NewConn()
    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(new_dbconn)

    create_fn_err := new_dbconn.CreateFunction("newuser", &sqlite.FunctionImpl{
        NArgs: 5,
        Deterministic: true,
        Scalar: newuserScalarFn,
    })

    if loggers.RequestLog(create_fn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    new_tk := jwt.Token{
        UserId: -1,
    }

    query_stmt := sqlf.Select(
        "newuser(?, ?, ?, ?, ?)",
        req_payload.TierId,
        req_payload.Username,
        req_payload.Username,
        req_payload.Mail,
        req_payload.Passwd,
    )

    defer query_stmt.Close()

    query := query_stmt.String()
    exec_err := sqlitex.ExecuteTransient(new_dbconn, query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            if stmt.ColumnType(0) == sqlite.TypeText {
                return errors.New(stmt.ColumnText(0))
            }

            new_tk.UserId = stmt.ColumnInt(0)
            return nil
        },

        Args: query_stmt.Args(),
    })

    if new_tk.UserId == -1 {
        loggers.RequestLog(nil, "no user was created", http.StatusInternalServerError, &w)
        return
    }

    if loggers.RequestLog(exec_err, "", http.StatusBadRequest, &w) {
        return
    }

    new_dir := strconv.Itoa(new_tk.UserId)
    mkdir_err := os.MkdirAll(stiller.StillerConfig.FilesPath + new_dir, os.ModePerm)
    if loggers.RequestLog(mkdir_err, "", http.StatusInternalServerError, &w) {
        return
    }

    new_user, newuser_err := dbutils.GetUserById(new_tk.UserId, new_dbconn)
    new_user.Bpasswd = ""
    if loggers.RequestLog(newuser_err, "", http.StatusInternalServerError, &w) {
        return
    }

    sign_encoded, sign_err := new_tk.Encode()
    if loggers.RequestLog(sign_err, "", http.StatusInternalServerError, &w) {
        return
    }

    res_payload.UserData = new_user
    res_payload.Token = string(sign_encoded)

    jsonexp.MarshalWrite(w, res_payload, jsonexp.DefaultOptionsV2())
}




