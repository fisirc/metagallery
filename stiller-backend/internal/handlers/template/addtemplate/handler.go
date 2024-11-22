package addtemplate

import (
	"archive/tar"
	"bufio"
	"net/http"
	"os"
	"stiller/internal/dbutils"
	"stiller/internal/fsutils"
	"stiller/internal/handlers/handleutils"
	"stiller/internal/jwtutils"
	"stiller/internal/tarutils"
	"strconv"

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

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwtutils.Decode(user_token)
    if handleutils.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    user_id := user_tk.UserId
    if user_id != handleutils.ADMIN_ID {
        handleutils.RequestLog(nil, "non admin user", http.StatusUnauthorized, &w)
        return
    }

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

    dbconn, dbconn_err := dbutils.NewConn()
    if handleutils.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    templatefile_stmt := sqlf.
        New("insert into metatemplatefile").
            Expr("default values").
        Returning("id")

    templatefile_id := int(-1)
    templatefile_query := templatefile_stmt.String()
    templatefile_exec_err := sqlitex.ExecuteTransient(dbconn, templatefile_query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            templatefile_id = int(stmt.GetInt64("id"))
            return nil
        },

        Args: templatefile_stmt.Args(),
    })

    if handleutils.RequestLog(templatefile_exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if templatefile_id == -1 {
        handleutils.RequestLog(nil, "no new template row was created", http.StatusInternalServerError, &w)
        return
    }

    abs_path := fsutils.GetTemplatePath(templatefile_id)

    tarfile, tarball_err := os.Create(abs_path)
    if handleutils.RequestLog(tarball_err, "", http.StatusInternalServerError, &w) {
        return
    }

    tarball_writer := tar.NewWriter(tarfile)

    slots_file, slots_header, slotsfile_err := r.FormFile("slots")
    if handleutils.RequestLog(slotsfile_err, "", http.StatusBadRequest, &w) {
        return
    }

    defer slots_file.Close()

    model_file, model_header, modelfile_err := r.FormFile("model")
    if handleutils.RequestLog(modelfile_err, "", http.StatusBadRequest, &w) {
        return
    }

    defer model_file.Close()

    bufslots := bufio.NewReader(slots_file)
    modelslots := bufio.NewReader(model_file)

    writeslot_err := tarutils.TarPushFile(
        tarball_writer,
        bufslots,
        slots_header.Filename,
        slots_header.Size,
    )

    if handleutils.RequestLog(writeslot_err, "", http.StatusInternalServerError, &w) {
        return
    }

    writemodel_err := tarutils.TarPushFile(
        tarball_writer,
        modelslots,
        model_header.Filename,
        model_header.Size,
    )

    if handleutils.RequestLog(writemodel_err, "", http.StatusInternalServerError, &w) {
        return
    }

    close_tarball_writer :=  tarball_writer.Close()
    if handleutils.RequestLog(close_tarball_writer, "", http.StatusInternalServerError, &w) {
        return
    }

    close_tarfile_err := tarfile.Close()
    if handleutils.RequestLog(close_tarfile_err, "", http.StatusInternalServerError, &w) {
        return
    }

    newtempl_stmt := sqlf.
    InsertInto("template").
        NewRow().
            Set("tier", req_payload.TierId).
            Set("thumbnail", req_payload.ThumbnailId).
            Set("title", req_payload.Title).
            Set("description", req_payload.Description).
            Set("templatefile", templatefile_id).
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

