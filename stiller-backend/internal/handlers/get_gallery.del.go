package handlers

import (
	"net/http"
	"stiller/pkg/checkers"
	"stiller/pkg/dbutils"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"

	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)


func GetGalleryDel(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    gallery_slug := params.ByName("gallery_slug")
    if len(gallery_slug) == 0 {
        loggers.RequestLog(nil, "empty slug", http.StatusNotFound, &w)
        return
    }

    new_dbconn, conn_err := dbutils.NewConn()
    if loggers.RequestLog(conn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(new_dbconn)

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwt.Decode(user_token)
    if loggers.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    user_id := user_tk.UserId

    is_owner, owner_err := checkers.IsGalleryOwner(user_id, gallery_slug, new_dbconn)
    if loggers.RequestLog(owner_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if !is_owner {
        loggers.RequestLog(nil, "not the owner", http.StatusUnauthorized, &w)
        return
    }

    getpath_stmt := sqlf.
        Update("gallery").
            Where("owner = ? and slug = ?", user_id, gallery_slug).
        Set("deleted", true).
        Returning("deleted")

    deleted := false
    exec_err := sqlitex.ExecuteTransient(new_dbconn, getpath_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            deleted = stmt.GetBool("deleted")
            return nil
        },

        Args: getpath_stmt.Args(),
    })

    if loggers.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if !deleted {
        loggers.RequestLog(nil, "gallery wasn't deleted", http.StatusInternalServerError, &w)
        return
    }

    w.WriteHeader(http.StatusOK)
}

