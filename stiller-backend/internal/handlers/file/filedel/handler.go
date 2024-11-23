package filedel

import (
	"net/http"
	"stiller/internal/check"
	"stiller/internal/dbutils"
	"stiller/internal/handlers/handleutils"
	"stiller/internal/jwtutils"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
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

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwtutils.Decode(user_token)
    if handleutils.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    user_id := user_tk.UserId

    is_owner, owner_err := check.IsFileOwner(user_id, file_id, new_dbconn)
    if handleutils.RequestLog(owner_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if !is_owner {
        handleutils.RequestLog(nil, "not the owner", http.StatusUnauthorized, &w)
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

    if handleutils.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    w.WriteHeader(http.StatusOK)
}

