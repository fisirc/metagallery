package patchfile

import (
	"net/http"
	"stiller/internal/dbutils"
	"stiller/internal/handlers/handleutils"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func NetHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    if handleutils.CORS(w, r) {
        return
    }

    type ReqPayload struct {
        Id          int    `json:"id"`
        Title       string `json:"title"`
        Description string `json:"description"`
    }

    rpayload := ReqPayload{}
    unmarshal_err := jsonexp.UnmarshalRead(r.Body, &rpayload, jsonexp.DefaultOptionsV2())
    if handleutils.RequestLog(unmarshal_err, "", http.StatusNotFound, &w) {
        return
    }

    new_dbconn, dbconn_err := dbutils.NewConn()
    if handleutils.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(new_dbconn)

    query := `update file set title=?1, description=?2 where id = ?3 returning *;`

    new_file := dbutils.StillerFile{}
    exec_err := sqlitex.ExecuteTransient(new_dbconn, query, &sqlitex.ExecOptions{
        Args: []any{
            rpayload.Title,
            rpayload.Description,
            rpayload.Id,
        },
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_file = dbutils.StillerFile{
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

            return nil
        },
    })

    if handleutils.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    w.WriteHeader(http.StatusOK)
    jsonexp.MarshalWrite(w, new_file, jsonexp.DefaultOptionsV2())
}


