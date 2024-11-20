package addtemplate

import (
	"archive/tar"
	"net/http"
	"stiller/internal/dbutils"
	"stiller/internal/handlers/handleutils"
	"strconv"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

const (
    KB = 1024
    MB = 1024 * KB
)

func NetHandler(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if handleutils.CORS(w, r) {
        return
    }

    type ReqPayload dbutils.StillerTemplate

    form_err := r.ParseMultipartForm(100 * MB)
    if handleutils.RequestLog(form_err, "", http.StatusBadRequest, &w) {
        return
    }

    req_payload := ReqPayload{}

    tier_str := r.FormValue("tier")
    if len(tier_str) == 0 {
        handleutils.RequestLog(nil, "empty tier", http.StatusBadRequest, &w)
        return
    }

    thumbnail_str := r.FormValue("thumbnail")
    if len(thumbnail_str) == 0 {
        handleutils.RequestLog(nil, "empty thumbnail", http.StatusBadRequest, &w)
        return
    }

    title_str := r.FormValue("title")
    if len(title_str) == 0 {
        handleutils.RequestLog(nil, "empty title", http.StatusBadRequest, &w)
        return
    }

    description_str := r.FormValue("description")
    if len(description_str) == 0 {
        handleutils.RequestLog(nil, "empty description", http.StatusBadRequest, &w)
        return
    }

    var err error
    req_payload.TierId, err = strconv.Atoi(tier_str)
    if handleutils.RequestLog(err, "", http.StatusBadRequest, &w) {
        return
    }

    req_payload.ThumbnailId, err = strconv.Atoi(thumbnail_str)
    if handleutils.RequestLog(err, "", http.StatusBadRequest, &w) {
        return
    }

    req_payload.Title = title_str
    req_payload.Description = description_str

    slots_file, _, slotsfile_err := r.FormFile("slots")
    if handleutils.RequestLog(slotsfile_err, "", http.StatusBadRequest, &w) {
        return
    }

    modelfile, _, modelfile_err := r.FormFile("model")
    if handleutils.RequestLog(modelfile_err, "", http.StatusBadRequest, &w) {
        return
    }







    dbconn, dbconn_err := dbutils.NewConn()
    if handleutils.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    newtempl_stmt := sqlf.
    InsertInto("template").
        NewRow().
            Set("tier", req_payload.TierId).
            Set("thumbnail", req_payload.ThumbnailId).
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

    w.WriteHeader(http.StatusOK)
}

