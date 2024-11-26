package handlers

import (
	"log"
	"net/http"
	"stiller/pkg/dbutils"
	"stiller/pkg/fsop"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)


func GetFileDl(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    file_id_str := params.ByName("file_id")
    file_id, file_id_err := strconv.Atoi(file_id_str)
    if loggers.RequestLog(file_id_err, "", http.StatusNotFound, &w) {
        return
    }

    new_dbconn, conn_err := dbutils.NewConn()
    if loggers.RequestLog(
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

    if loggers.RequestLog(exec_err, "", http.StatusNotFound, &w) {
        return
    }

    fexists, fexists_err := fsop.FileExists(path)
    if loggers.RequestLog(fexists_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if !fexists {
        loggers.GenericErrLog(nil, "path '%s' doesnt exist", path)
    }

    log.Println(path)
    http.ServeFile(w, r, path)
}

