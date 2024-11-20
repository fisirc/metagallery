package filedl

import (
	"net/http"
	"stiller/internal/dbutils"
	"stiller/internal/fsutils"
	"stiller/internal/handlers/handleutils"
	"stiller/internal/jwtutils"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)


func Nethandler(
    w http.ResponseWriter,
    r *http.Request,
    params httprouter.Params,
) {
    if handleutils.CORS(w, r) {
        return
    }

    type ReqPayload struct {
        FileId int `json:"file_id"`
    }

    req_payload := ReqPayload{}
    unmarshal_err := jsonexp.UnmarshalRead(
        r.Body,
        &req_payload,
        jsonexp.DefaultOptionsV2(),
    )

    if handleutils.RequestLog(
        unmarshal_err,
        "",
        http.StatusBadRequest,
        &w,
    ) {
        return
    }

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwtutils.Decode(user_token)
    if handleutils.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    new_dbconn, conn_err := dbutils.NewConn()
    if handleutils.RequestLog(
        conn_err,
        "",
        http.StatusInternalServerError,
        &w,
    ) {
        return
    }

    user_id := user_tk.UserId
    getpath_stmt := sqlf.
    Select("path").
        From("file").
        Where("owner = ?", user_id)

    getpath_query := getpath_stmt.String()
    path := ""

    exec_err := sqlitex.ExecuteTransient(
        new_dbconn,
        getpath_query,
        &sqlitex.ExecOptions{
            ResultFunc: func(stmt *sqlite.Stmt) error {
                path = stmt.GetText("path")
                return nil
            },

            Args: getpath_stmt.Args(),
        },
    )

    if handleutils.RequestLog(exec_err, "", http.StatusNotFound, &w) {
        return
    }

    fexists, fexists_err := fsutils.FileExists(path)
    if handleutils.RequestLog(fexists_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if !fexists {
        handleutils.GenericLog(nil, "path '%s' doesnt exist", path)
    }

    http.ServeFile(w, r, path)
}

