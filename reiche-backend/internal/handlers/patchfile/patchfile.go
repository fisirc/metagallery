package patchfile

import (
	"net/http"
	"reiche"
	"reiche/internal/db"
	handlers "reiche/internal/handlers/handleutils"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func PatchFile(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    type ReqPayload struct {
        Id          int    `json:"id"`
        Title       string `json:"title"`
        Description string `json:"description"`
    }

    rpayload := ReqPayload{}
    unmarshal_err := jsonexp.UnmarshalRead(r.Body, &rpayload, jsonexp.DefaultOptionsV2())
    if handlers.RequestLog(unmarshal_err, "", http.StatusNotFound, &w) {
        return
    }

    new_dbconn, dbconn_err := sqlite.OpenConn(reiche.ReicheConfig.DBPath)
    if handlers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer new_dbconn.Close()

    query := `update file set title=?1, description=?2 where id = ?3 returning *;`

    new_file := db.ReicheFile{}
    exec_err := sqlitex.ExecuteTransient(new_dbconn, query, &sqlitex.ExecOptions{
        Args: []any{
            rpayload.Title,
            rpayload.Description,
            rpayload.Id,
        },
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_file = db.ReicheFile{
                Id: int(stmt.GetInt64("id")),
                OwnerId: int(stmt.GetInt64("owner")),
                Typeof: db.ReicheFileType(stmt.GetInt64("type")),
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

    if handlers.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    w.WriteHeader(http.StatusOK)
    jsonexp.MarshalWrite(w, new_file, jsonexp.DefaultOptionsV2())
}


