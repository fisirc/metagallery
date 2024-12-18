package handlers

import (
	"net/http"
	"stiller"
	"stiller/pkg/dbutils"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"
	"strconv"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func GetFile(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwt.Decode(user_token)
    if loggers.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    new_dbconn, dbconn_err := sqlite.OpenConn(stiller.StillerConfig.DBPath)
    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer new_dbconn.Close()

    user_count := int(-1)
    count_users_stmt := sqlf.
        Select("count(id)").
            From("user").
        Where("id = ?", user_tk.UserId)

    sqlitex.ExecuteTransient(new_dbconn, count_users_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            user_count = stmt.ColumnInt(0)
            return nil
        },

        Args: count_users_stmt.Args(),
    })

    if user_count == -1 {
        loggers.RequestLog(nil, "user does not exist", http.StatusNotFound, &w)
        return
    }

    query := `select count(*) from file where (owner=?1);`

    row_len := int(0)
    rowlen_exec_err := sqlitex.ExecuteTransient(
        new_dbconn,
        query,
        &sqlitex.ExecOptions{
            ResultFunc: func(stmt *sqlite.Stmt) error {
                row_len = stmt.ColumnInt(0)
                return nil
            },
            Args: []any{
                user_tk.UserId,
            },
        },
    )

    if loggers.RequestLog(rowlen_exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    getfiles_stmt := sqlf.
        Select("*").
            From("file").
        Where("owner = ?", user_tk.UserId)

    files := make([]dbutils.StillerFile, 0, row_len)
    exec_err := sqlitex.ExecuteTransient(
        new_dbconn,
        getfiles_stmt.String(),
        &sqlitex.ExecOptions{
            ResultFunc: func(stmt *sqlite.Stmt) error {
                new_id := int(stmt.GetInt64("id"))

                tmp_newf := dbutils.StillerFile{
                    Id: new_id,
                    OwnerId: int(stmt.GetInt64("owner")),
                    Typeof: dbutils.StillerFileType(stmt.GetInt64("type")),
                    Url: stiller.StillerConfig.FileBucket + strconv.Itoa(new_id),
                    Path: stmt.GetText("path"),
                    Filename: stmt.GetText("filename"),
                    Title: stmt.GetText("title"),
                    Description: stmt.GetText("description"),
                    Ext: stmt.GetText("ext"),
                    Hashed: stmt.GetBool("hashed"),
                    Size: int(stmt.GetInt64("size")),
                    Deleted: stmt.GetBool("deleted"),
                }

                files = append(files, tmp_newf)
                return nil
            },

            Args: getfiles_stmt.Args(),
        },
    )

    if loggers.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    w.WriteHeader(http.StatusOK)
    jsonexp.MarshalWrite(w, files, jsonexp.DefaultOptionsV2())
}



