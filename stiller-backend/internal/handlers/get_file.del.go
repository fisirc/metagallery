package handlers

import (
	"net/http"
	"stiller/pkg/checkers"
	"stiller/pkg/dbutils"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite/sqlitex"
)


func GetFileDel(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
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

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwt.Decode(user_token)
    if loggers.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    user_id := user_tk.UserId

    is_owner, owner_err := checkers.IsFileOwner(user_id, file_id, new_dbconn)
    if loggers.RequestLog(owner_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if !is_owner {
        loggers.RequestLog(nil, "not the owner", http.StatusUnauthorized, &w)
        return
    }

    getpath_stmt := sqlf.
        Update("file").
            Where("owner = ? and id = ?", user_id, file_id).
        Set("deleted", true)

    exec_err := sqlitex.ExecuteTransient(
        new_dbconn,
        getpath_stmt.String(),
        &sqlitex.ExecOptions{
            Args: getpath_stmt.Args(),
        },
    )

    if loggers.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    w.WriteHeader(http.StatusOK)
}

