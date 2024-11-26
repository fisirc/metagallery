package handlers

import (
	"archive/tar"
	"bufio"
	"net/http"
	"os"
	"stiller/pkg/dbutils"
	"stiller/pkg/fsop"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"
	"stiller/pkg/templates"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)


func PostGalleryNew(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if netwrappers.CORS(w, r) {
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
    if loggers.RequestLog(unmarshal_err, "", http.StatusBadRequest, &w) {
        return
    }

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwt.Decode(user_token)
    if loggers.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
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
    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
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

    if loggers.RequestLog(exec_err, "", http.StatusBadRequest, &w) {
        return
    }

    if newgallery_id == -1 {
        loggers.GenericErrLog(nil, "no new template was created")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    path := fsop.GetTemplatePath(req_payload.Template)
    file, open_err := os.Open(path)
    if loggers.RequestLog(open_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer file.Close()

    tar_reader := tar.NewReader(file)
    _, read_err := tar_reader.Next()
    if loggers.RequestLog(read_err, "", http.StatusInternalServerError, &w) {
        return
    }

    buftar := bufio.NewReader(tar_reader)

    templatefile_slots := []templates.MetatemplateSlot{}
    slotunmarshal_exp := jsonexp.UnmarshalRead(buftar, &templatefile_slots, jsonexp.DefaultOptionsV2())
    if loggers.RequestLog(slotunmarshal_exp, "", http.StatusInternalServerError, &w) {
        return
    }

    insert_slots_stmt := sqlf.
        InsertInto("galleryslot")

    for index := range templatefile_slots {
        insert_slots_stmt.NewRow().
            Set("gallery", newgallery_id).
            Set("slotid", templatefile_slots[index].Ref)
    }

    insert_slots_err := sqlitex.ExecuteTransient(dbconn, insert_slots_stmt.String(), &sqlitex.ExecOptions{
        Args: insert_slots_stmt.Args(),
    })

    if loggers.RequestLog(insert_slots_err, "", http.StatusInternalServerError, &w) {
        return
    }

    gallery_slots := make([]dbutils.StillerGallerySlot, 0, len(templatefile_slots))
    for index := range templatefile_slots {
        gallery_slots = append(gallery_slots, dbutils.StillerGallerySlot{
            Ref: templatefile_slots[index].Ref,
            Type: templatefile_slots[index].Type,
            Props: templatefile_slots[index].Props,
            Vertices: templatefile_slots[index].Vertices,
        })
    }

    res_payload := dbutils.StillerGallery{
        Id: newgallery_id,
        Title: req_payload.Title,
        Description: req_payload.Description,
        OwnerId: user_id,
        TemplateId: req_payload.Template,
        Slug: req_payload.Slug,
        Slots: gallery_slots,
    }

    marshal_err := jsonexp.MarshalWrite(w, res_payload, jsonexp.DefaultOptionsV2())
    if loggers.RequestLog(marshal_err, "", http.StatusInternalServerError, &w) {
        return
    }
}

