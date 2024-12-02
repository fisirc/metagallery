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
	"stiller/pkg/tarop"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func PostTemplateNew(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    type ReqPayload dbutils.StillerTemplate

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwt.Decode(user_token)
    if loggers.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    user_id := user_tk.UserId
    if user_id != netwrappers.ADMIN_ID {
        loggers.RequestLog(nil, "non admin user", http.StatusUnauthorized, &w)
        return
    }

    form_err := r.ParseMultipartForm(100 * MB)
    if loggers.RequestLog(form_err, "", http.StatusBadRequest, &w) {
        return
    }

    req_payload := ReqPayload{}

    tier_str := r.FormValue("tier")
    if len(tier_str) == 0 {
        loggers.RequestLog(nil, "empty tier", http.StatusBadRequest, &w)
        return
    }

    req_payload.Title = r.FormValue("title")
    if len(req_payload.Title) == 0 {
        loggers.RequestLog(nil, "empty title", http.StatusBadRequest, &w)
        return
    }

    req_payload.Description = r.FormValue("description")
    if len(req_payload.Description) == 0 {
        loggers.RequestLog(nil, "empty description", http.StatusBadRequest, &w)
        return
    }

    var tier_err error
    req_payload.TierId, tier_err = strconv.Atoi(tier_str)
    if loggers.RequestLog(tier_err, "", http.StatusBadRequest, &w) {
        return
    }

    new_dbconn, dbconn_err := dbutils.NewConn()
    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(new_dbconn)

    templatefile_stmt := sqlf.
        New("insert into metatemplatefile").
            Expr("default values").
        Returning("id")

    templatefile_id := int(-1)
    templatefile_query := templatefile_stmt.String()
    templatefile_exec_err := sqlitex.ExecuteTransient(new_dbconn, templatefile_query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            templatefile_id = int(stmt.GetInt64("id"))
            return nil
        },

        Args: templatefile_stmt.Args(),
    })

    if loggers.RequestLog(templatefile_exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if templatefile_id == -1 {
        loggers.RequestLog(nil, "no new template row was created", http.StatusInternalServerError, &w)
        return
    }

    abs_path := fsop.GetTemplatePath(templatefile_id)
    tarfile, tarball_err := os.Create(abs_path)
    if loggers.RequestLog(tarball_err, "", http.StatusInternalServerError, &w) {
        return
    }

    tarball_writer := tar.NewWriter(tarfile)
    file_keys := [...]string{ "data", "scene", "thumbnail", "topview" }
    for index := range file_keys {
        file_reader, file_header, file_err := r.FormFile(file_keys[index])
        if loggers.RequestLog(file_err, "", http.StatusBadRequest, &w) {
            return
        }

        buf_file := bufio.NewReader(file_reader)
        write_err := tarop.TarPushFile(
            tarball_writer,
            buf_file,
            file_header.Filename,
            file_header.Size,
        )

        if loggers.RequestLog(write_err, "", http.StatusInternalServerError, &w) {
            return
        }

        close_err := file_reader.Close()
        if loggers.RequestLog(close_err, "", http.StatusInternalServerError, &w) {
            return
        }
    }

    close_tarball_writer :=  tarball_writer.Close()
    if loggers.RequestLog(close_tarball_writer, "", http.StatusInternalServerError, &w) {
        return
    }

    close_tarfile_err := tarfile.Close()
    if loggers.RequestLog(close_tarfile_err, "", http.StatusInternalServerError, &w) {
        return
    }

    newtempl_stmt := sqlf.
    InsertInto("template").
        NewRow().
            Set("tier", req_payload.TierId).
            Set("title", req_payload.Title).
            Set("description", req_payload.Description).
            Set("templatefile", templatefile_id).
            Set("owner", user_id).
        Returning("id")

    newtempl_query, newtempl_args := newtempl_stmt.String(), newtempl_stmt.Args()
    newtemp_id := int(-1)
    newtemp_exec_err := sqlitex.ExecuteTransient(new_dbconn, newtempl_query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            newtemp_id = int(stmt.GetInt64("id"))
            return nil
        },

        Args: newtempl_args,
    })

    if loggers.RequestLog(newtemp_exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if newtemp_id == -1 {
        loggers.GenericErrLog(nil, "no new template was created")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
}

