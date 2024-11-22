package addgallery

import (
	"archive/tar"
	"bufio"
	"net/http"
	"os"
	"stiller/internal/dbutils"
	"stiller/internal/fsutils"
	"stiller/internal/handlers/handleutils"
	"stiller/internal/jwtutils"
	"stiller/internal/templates"

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

    type ReqPayload struct {
        Template    int    `json:"template"`
        Slug        string `json:"slug"`
        Title       string `json:"title"`
        Description string `json:"description"`
    }

    type ResPayload dbutils.StillerGallery
    req_payload := ReqPayload{}
    unmarshal_err := jsonexp.UnmarshalRead(r.Body, &req_payload, jsonexp.DefaultOptionsV2())
    if handleutils.RequestLog(unmarshal_err, "", http.StatusBadRequest, &w) {
        return
    }

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwtutils.Decode(user_token)
    if handleutils.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    user_id := user_tk.UserId

    newgallery_stmt := sqlf.InsertInto("gallery").
        NewRow().
            Set("owner", user_id).
            Set("template", req_payload.Template).
            Set("slug", req_payload.Slug).
            Set("title", req_payload.Title).
            Set("description", req_payload.Description).
        Returning("id")

    newgallery_query, newgallery_args := newgallery_stmt.String(), newgallery_stmt.Args()

    dbconn, dbconn_err := dbutils.NewConn()
    if handleutils.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(dbconn)

    newgallery_id := int(-1)
    exec_err := sqlitex.ExecuteTransient(dbconn, newgallery_query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            newgallery_id = int(stmt.GetInt64("id"))
            return nil
        },

        Args: newgallery_args,
    })

    if handleutils.RequestLog(exec_err, "", http.StatusBadRequest, &w) {
        return
    }

    if newgallery_id == -1 {
        handleutils.GenericLog(nil, "no new template was created")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    path := fsutils.GetTemplatePath(req_payload.Template)
    file, open_err := os.Open(path)
    if handleutils.RequestLog(open_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer file.Close()

    tar_reader := tar.NewReader(file)
    _, read_err := tar_reader.Next()
    if handleutils.RequestLog(read_err, "", http.StatusInternalServerError, &w) {
        return
    }

    buftar := bufio.NewReader(tar_reader)

    slots := []templates.MetatemplateSlot{}
    slotunmarshal_exp := jsonexp.UnmarshalRead(buftar, &slots, jsonexp.DefaultOptionsV2())
    if handleutils.RequestLog(slotunmarshal_exp, "", http.StatusInternalServerError, &w) {
        return
    }

    insert_slots_stmt := sqlf.
        InsertInto("galleryslot")

    for index := range slots {
        insert_slots_stmt.NewRow().
            Set("gallery", newgallery_id).
            Set("slotid", slots[index].Id)
    }

    insert_slots_err := sqlitex.ExecuteTransient(dbconn, insert_slots_stmt.String(), &sqlitex.ExecOptions{
        Args: insert_slots_stmt.Args(),
    })

    if handleutils.RequestLog(insert_slots_err, "", http.StatusInternalServerError, &w) {
        return
    }
}

