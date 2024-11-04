package upload

import (
	"bufio"
	"encoding/binary"
	"errors"
	"io"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"stiller"
	"stiller/internal/db"
	"stiller/internal/fsutils"
	"stiller/internal/handlers/handleutils"
	"strconv"

	"github.com/cespare/xxhash"
	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

const BUFSIZE = 512
const temporalUSERID = 0

var (
    ErrFileExists = errors.New("filename already exists, try another name")
)

func pushNewFile(fileptr *db.StillerFile) (int, error) {
    new_dbconn, dbconn_err := sqlite.OpenConn(stiller.StillerConfig.DBPath)
    if dbconn_err != nil {
        return 0, dbconn_err
    }

    defer new_dbconn.Close()

    query := `insert into file (owner, type, path, filename, ext, hashed, size, deleted) values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8) returning id;`
    query_id_res := int(0)

    exec_err := sqlitex.ExecuteTransient(new_dbconn, query, &sqlitex.ExecOptions{
        Args: []any{
            fileptr.OwnerId,
            fileptr.Typeof,
            fileptr.Path,
            fileptr.Filename,
            fileptr.Ext,
            fileptr.Hashed,
            fileptr.Size,
            fileptr.Deleted,
        },
        ResultFunc: func(stmt *sqlite.Stmt) error {
            query_id_res = int(stmt.ColumnInt64(0))
            return nil
        },
    })

    if exec_err != nil {
        return 0, exec_err
    }

    return query_id_res, nil
}

func NetHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    type ResPayload struct {
        Id int `json:"id"`
    }

    filename := r.Header.Get("stiller-name")
    if len(filename) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    abs_path := stiller.StillerConfig.FilesPath + strconv.Itoa(temporalUSERID) + "/" + filename;

    file_exists, file_err := fsutils.FileExists(abs_path)
    if handleutils.RequestLog(file_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if file_exists {
        handleutils.RequestLog(ErrFileExists, "", http.StatusUnprocessableEntity, &w)
        return
    }

    filetype_str := r.Header.Get("stiller-type")
    if len(filetype_str) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    filetype, filetype_err := strconv.ParseUint(filetype_str, 10, 8)
    if handleutils.RequestLog(filetype_err, "", http.StatusNotAcceptable, &w) {
        return
    }

    if filetype > math.MaxUint8 {
        handleutils.GenericLog(nil, "invalid filetype, 0 < ft < %d", db.Unreachable)
        return
    }

    if db.StillerFileType(filetype) >= db.Unreachable {
        handleutils.GenericLog(nil, "invalid filetype, 0 < ft < %d", db.Unreachable)
        return
    }


    ishashed_str := r.Header.Get("stiller-hash")
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

    writer, open_err := os.Create(abs_path)
    if handleutils.RequestLog(open_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer writer.Close()

    var hashed_writer *os.File
    var hashed_writer_err error
    if (ishashed_flag) {
        hashed_writer, hashed_writer_err = os.Create(abs_path + ".xxhash")
        if handleutils.RequestLog(hashed_writer_err, "", http.StatusInternalServerError, &w) {
            return
        }

        defer hashed_writer.Close()
    }

    new_file := db.StillerFile{
        OwnerId: temporalUSERID,
        Typeof: db.StillerFileType(filetype),
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

    body_reader := bufio.NewReader(r.Body)
    if body_reader == nil {
        return
    }

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
        _, write_regular_err := writer.Write(normal_buf)
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


