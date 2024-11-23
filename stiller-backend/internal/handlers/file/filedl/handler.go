package filedl

import (
	"log"
	"net/http"
	"stiller/internal/dbutils"
	"stiller/internal/fsutils"
	"stiller/internal/handlers/handleutils"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)


func Nethandler(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if handleutils.CORS(w, r) {
        return
    }

    file_id_str := params.ByName("file_id")
    file_id, file_id_err := strconv.Atoi(file_id_str)
    if handleutils.RequestLog(file_id_err, "", http.StatusNotFound, &w) {
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

    defer dbutils.CloseConn(new_dbconn)

    getpath_stmt := sqlf.
    Select("path").
        From("file").
        Where("id = ?", file_id)

    path := ""
    exec_err := sqlitex.ExecuteTransient(
        new_dbconn,
        getpath_stmt.String(),
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

    log.Println(path)
    http.ServeFile(w, r, path)
}

