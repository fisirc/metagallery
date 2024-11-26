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
            From("gallery").
        Where("owner = ?", user_id)

    galleries := make([]dbutils.StillerGallery, 0, 2)
    exec_err := sqlitex.ExecuteTransient(new_dbconn, get_galleries.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            gall_template := int(stmt.GetInt64("template"))
            gall_id := int(stmt.GetInt64("id"))

            template_path := fsop.GetTemplatePath(gall_template)
            file, open_err := os.Open(template_path)
            if loggers.RequestLog(open_err, "", http.StatusInternalServerError, &w) {
                return open_err
            }

            defer file.Close()

            tar_reader := tar.NewReader(file)
            _, read_err := tar_reader.Next()
            if loggers.RequestLog(read_err, "", http.StatusInternalServerError, &w) {
                return read_err
            }

            buftar := bufio.NewReader(tar_reader)


            new_gallery_slots, newgall_slots_err := dbutils.GetGallerySlots(gall_id, buftar)
            if loggers.RequestLog(newgall_slots_err, "", http.StatusInternalServerError, &w) {
                return newgall_slots_err
            }

            gallery := dbutils.StillerGallery{
                Id: gall_id,
                OwnerId: user_id,
                Title: stmt.GetText("title"),
                Description: stmt.GetText("description"),
                TemplateId: gall_template,
                Slug: stmt.GetText("slug"),
                Slots: new_gallery_slots,
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

