package upload

import (
	"bufio"
	"encoding/binary"
	"errors"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"stiller"
	"stiller/internal/dbutils"
	"stiller/internal/fsutils"
	"stiller/internal/handlers/handleutils"
	"stiller/internal/jwtutils"
	"strconv"

	"github.com/cespare/xxhash"
	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

const BUFSIZE = 512

const (
    KB = 1024
    MB = KB * 1024
    GB = MB * 1024
)

var (
    ErrFileExists = errors.New("filename already exists, try another name")
)

func pushNewFile(fileptr *dbutils.StillerFile) (int, error) {
    new_dbconn, dbconn_err := dbutils.NewConn()
    if dbconn_err != nil {
        return 0, dbconn_err
    }

    defer dbutils.CloseConn(new_dbconn)

    query_stmt := sqlf.InsertInto("file").
        Set("owner", fileptr.OwnerId).
        Set("type", fileptr.Typeof).
        Set("path", fileptr.Typeof).
        Set("filename", fileptr.Typeof).
        Set("ext", fileptr.Typeof).
        Set("hashed", fileptr.Typeof).
        Set("size", fileptr.Typeof).
        Set("deleted", fileptr.Typeof)

    query := query_stmt.String()
    query_id_res := int(0)

    exec_err := sqlitex.ExecuteTransient(new_dbconn, query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            query_id_res = int(stmt.ColumnInt64(0))
            return nil
        },

        Args: query_stmt.Args(),
    })

    if exec_err != nil {
        return 0, exec_err
    }

    return query_id_res, nil
}

func NetHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    if handleutils.CORS(w, r) {
        return
    }

    type ResPayload struct {
        Id int `json:"id"`
    }

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwtutils.Decode(user_token)
    if handleutils.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    user_id := user_tk.UserId

    multform_err := r.ParseMultipartForm(100 * MB)
    if handleutils.RequestLog(multform_err, "", http.StatusBadRequest, &w) {
        return
    }

    filename := r.FormValue("stiller-name")
    if len(filename) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    abs_path := stiller.StillerConfig.FilesPath + strconv.Itoa(user_id) + "/" + filename;

    file_exists, file_err := fsutils.FileExists(abs_path)
    if handleutils.RequestLog(file_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if file_exists {
        handleutils.RequestLog(ErrFileExists, "", http.StatusUnprocessableEntity, &w)
        return
    }

    filetype_str := r.FormValue("stiller-type")
    if len(filetype_str) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    filetype, filetype_err := strconv.ParseUint(filetype_str, 10, 8)
    if handleutils.RequestLog(filetype_err, "", http.StatusNotAcceptable, &w) {
        return
    }

    if dbutils.StillerFileType(filetype) >= dbutils.Unreachable {
        handleutils.GenericLog(nil, "invalid filetype, 0 < ft < %d", dbutils.Unreachable)
        return
    }

    ishashed_str := r.FormValue("stiller-hashed")
    if len(ishashed_str) != 1 {
        handleutils.GenericLog(nil, "invalid hash '%s' expected 0|1", ishashed_str)
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    var ishashed_flag bool
    switch ishashed_str {
    case "1":
        ishashed_flag = true
    case "0":
        ishashed_flag = false
    default:
        handleutils.GenericLog(nil, "invalid hash '%s' expected 0|1", ishashed_str)
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    form_file, _, form_file_err := r.FormFile("stiller-file")
    if handleutils.RequestLog(form_file_err, "", http.StatusBadRequest, &w) {
        return
    }

    defer form_file.Close()

    body_reader := bufio.NewReader(form_file)
    if body_reader == nil {
        return
    }

    local_writer, open_err := os.Create(abs_path)
    if handleutils.RequestLog(open_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer local_writer.Close()

    var hashed_writer *os.File
    var hashed_writer_err error
    if (ishashed_flag) {
        hashed_writer, hashed_writer_err = os.Create(abs_path + ".xxhash")
        if handleutils.RequestLog(hashed_writer_err, "", http.StatusInternalServerError, &w) {
            return
        }

        defer hashed_writer.Close()
    }

    new_file := dbutils.StillerFile{
        OwnerId: user_id,
        Typeof: dbutils.StillerFileType(filetype),
        Path: abs_path,
        Filename: filename,
        Ext: filepath.Ext(filename),
        Hashed: ishashed_flag,
        Size: 0,
    }

    var normal_buf_mem [BUFSIZE]byte
    normal_buf := normal_buf_mem[:]

    var hashed_buf_mem [8]byte
    hashed_buf := hashed_buf_mem[:]

    for {
        size, read_err := body_reader.Read(normal_buf)
        if errors.Is(read_err, io.EOF) {
            break
        } else if handleutils.RequestLog(read_err, "", http.StatusInternalServerError, &w) {
            return
        }

        if size == 0 {
            break
        } else if size != BUFSIZE {
            normal_buf = normal_buf[:size]
        }

        new_file.Size += size
        _, write_regular_err := local_writer.Write(normal_buf)
        if handleutils.RequestLog(write_regular_err, "", http.StatusInternalServerError, &w) {
            return
        }

        if (!ishashed_flag) {
            normal_buf = normal_buf[:cap(normal_buf)]
            continue
        }

        binary.NativeEndian.PutUint64(hashed_buf, xxhash.Sum64(normal_buf))
        _, write_hashed_err := hashed_writer.Write(hashed_buf)
        if handleutils.RequestLog(write_hashed_err, "", http.StatusInternalServerError, &w) {
            return
        }

        normal_buf = normal_buf[:cap(normal_buf)]
    }

    id, push_err := pushNewFile(&new_file)
    if handleutils.RequestLog(push_err, "", http.StatusInternalServerError, &w) {
        return
    }

    payload := ResPayload{
        Id: id,
    }

    w.WriteHeader(http.StatusOK)
    jsonexp.MarshalWrite(w, payload, jsonexp.DefaultOptionsV2())
}


