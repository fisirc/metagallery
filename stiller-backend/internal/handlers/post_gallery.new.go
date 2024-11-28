package handlers

import (
	"net/http"
	"stiller/pkg/dbutils"
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
    res_payload := ResPayload{}

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
    defer dbutils.CloseConn(dbconn)

    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    newgallery_id := int(-1)
    exec_err := sqlitex.ExecuteTransient(dbconn, newgallery_query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            newgallery_id = int(stmt.GetInt64("id"))
            return nil
        },

        Args: newgallery_args,
    })

    if loggers.RequestLog(exec_err, "", http.StatusConflict, &w) {
        return
    }

    if newgallery_id == -1 {
        loggers.GenericErrLog(nil, "no new template was created")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    template_data, template_data_err := templates.GetTemplateData(req_payload.Template)
    if loggers.RequestLog(template_data_err, "", http.StatusInternalServerError, &w) {
        return
    }

    gallery_slots := make(
        []dbutils.StillerGallerySlot,
        0,
        len(template_data.Slots),
    )

    new_gallery_slots_stmt := sqlf.
        InsertInto("galleryslot")


    for index := range template_data.Slots {
        new_gallery_slots_stmt.
        NewRow().
            Set("gallery", newgallery_id).
            Set("slotid", template_data.Slots[index].Ref)

        gallery_slots = append(gallery_slots, dbutils.StillerGallerySlot{
            MetatemplateSlot: template_data.Slots[index],
        })
    }

    insert_slots_err := sqlitex.ExecuteTransient(dbconn, new_gallery_slots_stmt.String(), &sqlitex.ExecOptions{
        Args: new_gallery_slots_stmt.Args(),
    })

    if loggers.RequestLog(insert_slots_err, "", http.StatusBadRequest, &w) {
        return
    }

    res_payload = ResPayload{
        Id: newgallery_id,
        OwnerId: user_id,
        TemplateId: req_payload.Template,
        Slug: req_payload.Slug,
        Title: req_payload.Title,
        Description: req_payload.Description,
        Data: dbutils.StillerGalleryData{
            Origin: template_data.Origin,
            Slots: gallery_slots,
        },
    }

    marshal_err := jsonexp.MarshalWrite(w, res_payload, jsonexp.DefaultOptionsV2())
    if loggers.RequestLog(marshal_err, "", http.StatusInternalServerError, &w) {
        return
    }
}

