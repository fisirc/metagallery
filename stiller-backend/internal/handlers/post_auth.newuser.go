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
    ErrUserExists = errors.New("user already exists")
)

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

    // Parseo del cuerpo JSON
    unmarshal_err := jsonexp.UnmarshalRead(r.Body, &req_payload, jsonexp.DefaultOptionsV2())
    if loggers.RequestLog(unmarshal_err, "", http.StatusBadRequest, &w) {
        return
    }

    // Creación de conexión a la base de datos
    new_dbconn, dbconn_err := dbutils.NewConn()
    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(new_dbconn)

    new_tk := jwt.Token{
        UserId: -1,
    }

    // Check if user already exists
    check_stmt := sqlf.
        Select("id").
        From("user").
        Where("username = ?", req_payload.Username)

    defer check_stmt.Close()

    user_exists := false
    check_err := sqlitex.ExecuteTransient(new_dbconn, check_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            user_exists = true
            return nil
        },
        Args: check_stmt.Args(),
    })

    if loggers.RequestLog(check_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if user_exists {
        loggers.RequestLog(ErrUserExists, "", http.StatusConflict, &w)
        return
    }

    // Hash the password using bcrypt
    passwdbytes := []byte(req_payload.Passwd)
    bcrypt_pwd, bcrypt_err := bcrypt.GenerateFromPassword(passwdbytes, stiller.StillerConfig.BCryptCost)
    if loggers.RequestLog(bcrypt_err, "", http.StatusInternalServerError, &w) {
        return
    }

    // Insert new user
    insert_stmt := sqlf.
        InsertInto("user").
            Set("tier", req_payload.TierId).
            Set("displayname", req_payload.Username).
            Set("username", req_payload.Username).
            Set("mail", req_payload.Mail).
            Set("bpasswd", string(bcrypt_pwd)).
        Returning("id")

    defer insert_stmt.Close()

    exec_err := sqlitex.ExecuteTransient(new_dbconn, insert_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_tk.UserId = stmt.ColumnInt(0)
            return nil
        },
        Args: insert_stmt.Args(),
    })

    if loggers.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if new_tk.UserId == -1 {
        loggers.RequestLog(nil, "no user was created", http.StatusInternalServerError, &w)
        return
    }

    // Creación del directorio del usuario
    new_dir := strconv.Itoa(new_tk.UserId)
    mkdir_err := os.MkdirAll(stiller.StillerConfig.FilesPath + new_dir, os.ModePerm)
    if loggers.RequestLog(mkdir_err, "", http.StatusInternalServerError, &w) {
        return
    }

    // Obtención de los datos del nuevo usuario
    new_user, newuser_err := dbutils.GetUserById(new_tk.UserId, new_dbconn)
    new_user.Bpasswd = "" // No devolver la contraseña hash
    if loggers.RequestLog(newuser_err, "", http.StatusInternalServerError, &w) {
        return
    }

    // Generación del token JWT
    sign_encoded, sign_err := new_tk.Encode()
    if loggers.RequestLog(sign_err, "", http.StatusInternalServerError, &w) {
        return
    }

    res_payload.UserData = new_user
    res_payload.Token = string(sign_encoded)

    // Respuesta al cliente
    jsonexp.MarshalWrite(w, res_payload, jsonexp.DefaultOptionsV2())
}




