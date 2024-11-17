package addtemplate

import (
	"net/http"
	"stiller/internal/dbutils"
	"stiller/internal/handlers/handleutils"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func NetHandler(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if handleutils.CORS(w, r) {
        return
    }

    type ReqPayload dbutils.StillerTemplate

    req_payload := ReqPayload{}
    read_err := jsonexp.UnmarshalRead(r.Body, &req_payload, jsonexp.DefaultOptionsV2())
    if handleutils.RequestLog(read_err, "", http.StatusBadRequest, &w) {
        return
    }

    dbconn, dbconn_err := dbutils.NewConn()
    if handleutils.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }


    blocks := req_payload.Blocks
    if len(blocks) == 0 {
        handleutils.GenericLog(nil, "invalid 0 blocks template")
        w.WriteHeader(http.StatusBadRequest)
        return
    }

    newtempl_stmt := sqlf.
    InsertInto("template").
        NewRow().
            Set("tier", req_payload.TierId).
            Set("thumbnail", req_payload.ThumbnailId).
            Set("res", req_payload.ResId).
            Set("title", req_payload.Title).
            Set("description", req_payload.Description).
        Returning("id")

    newtempl_query, newtempl_args := newtempl_stmt.String(), newtempl_stmt.Args()
    newtemp_id := int(-1)
    newtemp_exec_err := sqlitex.ExecuteTransient(dbconn, newtempl_query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            newtemp_id = int(stmt.GetInt64("id"))
            return nil
        },
        Args: newtempl_args,
    })

    if handleutils.RequestLog(newtemp_exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if newtemp_id == -1 {
        handleutils.GenericLog(nil, "no new template was created")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    prep_stmt := sqlf.InsertInto("templateblock")
    defer prep_stmt.Close()
    for index := range blocks {
        prep_stmt.NewRow().
            Set("template", newtemp_id).
            Set("posx", blocks[index].Posx).
            Set("posy", blocks[index].Posy).
            Set("direction", blocks[index].Direction)
    }

    blocks_execute_query, blocks_execute_args := prep_stmt.String(), prep_stmt.Args()
    blocks_execute_err := sqlitex.ExecuteTransient(dbconn, blocks_execute_query, &sqlitex.ExecOptions{
        Args: blocks_execute_args,
    })

    if handleutils.RequestLog(blocks_execute_err, "", http.StatusInternalServerError, &w) {
        return
    }

    w.WriteHeader(http.StatusOK)
}

