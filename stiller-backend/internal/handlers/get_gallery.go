package handlers

import (
	"net/http"
	"stiller/pkg/dbutils"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func GetGallery(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    type ResPayload []dbutils.StillerGallery

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwt.Decode(user_token)
    if loggers.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    user_id := user_tk.UserId

    new_dbconn, dbconn_err := dbutils.NewConn()
    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(new_dbconn)

    get_galleries := sqlf.
        Select("*").
            From("gallery")

    galleries := make([]dbutils.StillerGallery, 0, 2)
    exec_err := sqlitex.ExecuteTransient(new_dbconn, get_galleries.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            gall_template := int(stmt.GetInt64("template"))

            gall_id := int(stmt.GetInt64("id"))
            gallery_data, slots_err := dbutils.GetGalleryData(gall_id)
            if slots_err != nil {
                return slots_err
            }

            gallery := dbutils.StillerGallery{
                Id: gall_id,
                OwnerId: user_id,
                Title: stmt.GetText("title"),
                Description: stmt.GetText("description"),
                TemplateId: gall_template,
                Slug: stmt.GetText("slug"),
                Data: *gallery_data,
            }

            galleries = append(galleries, gallery)
            return nil
        },

        Args: get_galleries.Args(),
    })

    if loggers.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    writing_err := jsonexp.MarshalWrite(w, galleries, jsonexp.DefaultOptionsV2())
    if loggers.RequestLog(writing_err, "", http.StatusInternalServerError, &w) {
        return
    }
}

