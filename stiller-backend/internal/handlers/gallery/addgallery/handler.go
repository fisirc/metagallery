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

    if handleutils.RequestLog(exec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if newgallery_id == -1 {
        handleutils.GenericLog(nil, "no new template was created")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    templpath_stmt := sqlf.
        Select("path").
        From("file").
        Where("id = ?", req_payload.Template)

    metatemplate_path := ""
    templpath_query, temptemplpath_args := templpath_stmt.String(), templpath_stmt.Args()
    sqlitex.ExecuteTransient(dbconn, templpath_query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            metatemplate_path = stmt.GetText("path")
            return nil
        },
        Args: temptemplpath_args,
    })

    if len(metatemplate_path) == 0 {
        handleutils.GenericLog(nil, "no valid template, empty path")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    flag, flag_err := fsutils.FileExists(metatemplate_path)
    if handleutils.RequestLog(flag_err, "", http.StatusInternalServerError, &w){
        return
    }

    if !flag {
        handleutils.GenericLog(nil, "metatemplate not found")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    metatempl_file, open_err := os.Open(metatemplate_path)
    if handleutils.RequestLog(open_err, "", http.StatusInternalServerError, &w) {
        return
    }

    bufread := bufio.NewReader(metatempl_file)

    tarball := tar.NewReader(bufread)
    slots := []dbutils.StillerSlot{}
    slotread_err := jsonexp.UnmarshalRead(tarball, &slots, jsonexp.DefaultOptionsV2())
    if handleutils.RequestLog(slotread_err, "", http.StatusInternalServerError, &w) {
        return
    }

    newslots_stmt := sqlf.InsertInto("galleryslot")
    for index := range slots {
        newslots_stmt.NewRow().
            Set("gallery", newgallery_id).
            Set("slotref", slots[index].Ref)
    }

    newslots_query, newslots_args := newslots_stmt.String(), newslots_stmt.Args()
    sqlitex.ExecuteTransient(dbconn, newslots_query, &sqlitex.ExecOptions{
        Args: newslots_args,
    })
}

