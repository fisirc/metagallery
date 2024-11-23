package gallerytree

import (
	"archive/tar"
	"bufio"
	"net/http"
	"os"
	"stiller/internal/dbutils"
	"stiller/internal/fsutils"
	"stiller/internal/handlers/handleutils"
	"stiller/internal/jwtutils"

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

    type ResPayload []dbutils.StillerGallery

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwtutils.Decode(user_token)
    if handleutils.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    user_id := user_tk.UserId

    new_dbconn, dbconn_err := dbutils.NewConn()
    if handleutils.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
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

            template_path := fsutils.GetTemplatePath(gall_template)
            file, open_err := os.Open(template_path)
            if handleutils.RequestLog(open_err, "", http.StatusInternalServerError, &w) {
                return open_err
            }

            defer file.Close()

            tar_reader := tar.NewReader(file)
            _, read_err := tar_reader.Next()
            if handleutils.RequestLog(read_err, "", http.StatusInternalServerError, &w) {
                return read_err
            }

            buftar := bufio.NewReader(tar_reader)


            new_gallery_slots, newgall_slots_err := dbutils.GetGallerySlots(gall_id, buftar)
            if handleutils.RequestLog(newgall_slots_err, "", http.StatusInternalServerError, &w) {
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

    if handleutils.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    writing_err := jsonexp.MarshalWrite(w, galleries, jsonexp.DefaultOptionsV2())
    if handleutils.RequestLog(writing_err, "", http.StatusInternalServerError, &w) {
        return
    }
}

