package userverify

import (
	"net/http"
	"stiller/internal/dbutils"
	"stiller/internal/handlers/handleutils"

	"github.com/julienschmidt/httprouter"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)


func NetHandler(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    username := params.ByName("username")
    if len(username) == 0 {
        w.WriteHeader(http.StatusNotFound)
        return
    }

    new_dbconn, dbconn_err := dbutils.NewConn()
    if handleutils.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(new_dbconn)

    user_amount := int64(0)
    query := `select count(*) as amount from user where user.username = ?1`

    exec_err := sqlitex.ExecuteTransient(new_dbconn, query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            user_amount = stmt.GetInt64("amount")
            return nil
        },
        Args: []any{
            username,
        },
    })

    if handleutils.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if user_amount == 1 {
        w.WriteHeader(http.StatusOK)
        return
    }

    w.WriteHeader(http.StatusNotFound)
}


