package handlers

import (
	"net/http"
	"stiller/pkg/dbutils"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func PatchFile(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    type ReqPayload struct {
        Id          int    `json:"id"`
        Title       string `json:"title"`
        Description string `json:"description"`
    }

    rpayload := ReqPayload{}
    unmarshal_err := jsonexp.UnmarshalRead(r.Body, &rpayload, jsonexp.DefaultOptionsV2())
    if loggers.RequestLog(unmarshal_err, "", http.StatusNotFound, &w) {
        return
    }

    new_dbconn, dbconn_err := dbutils.NewConn()
    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
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

    if loggers.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    w.WriteHeader(http.StatusOK)
    jsonexp.MarshalWrite(w, new_file, jsonexp.DefaultOptionsV2())
}


