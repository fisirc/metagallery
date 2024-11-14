package fileretrieve

import (
	"net/http"
	"stiller"
	"stiller/internal/dbutils"
	"stiller/internal/handlers/handleutils"
	"stiller/internal/jwtutils"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func Nethandler(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwtutils.Decode(user_token)
    if handleutils.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    new_dbconn, dbconn_err := sqlite.OpenConn(stiller.StillerConfig.DBPath)
    if handleutils.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer new_dbconn.Close()

    ver_query := `select count(*) from user where (id=?1);`
    ver_query_stmt, _, ver_query_err := new_dbconn.PrepareTransient(ver_query)
    if handleutils.RequestLog(ver_query_err, "", http.StatusInternalServerError, &w) {
        return
    }

    user_count, user_count_err := sqlitex.ResultInt(ver_query_stmt)
    if handleutils.RequestLog(user_count_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if user_count != 1 {
        w.WriteHeader(http.StatusNotFound)
        handleutils.GenericLog(nil, "user does not exist")
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

    if handleutils.RequestLog(rowlen_exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    query = ""
    query = `select * from file where (owner=?1);`

    files := make([]dbutils.StillerFile, 0, row_len)
    exec_err := sqlitex.ExecuteTransient(
        new_dbconn,
        query,
        &sqlitex.ExecOptions{
            ResultFunc: func(stmt *sqlite.Stmt) error {
                tmp_newf := dbutils.StillerFile{
                    Id: int(stmt.GetInt64("id")),
                    OwnerId: int(stmt.GetInt64("owner")),
                    Typeof: dbutils.StillerFileType(stmt.GetInt64("type")),
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
            Args: []any{
                user_tk.UserId,
            },
        },
    )

    if handleutils.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    w.WriteHeader(http.StatusOK)
    jsonexp.MarshalWrite(w, files, jsonexp.DefaultOptionsV2())
}



