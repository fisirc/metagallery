package handlers

import (
	"bufio"
	"encoding/binary"
	"errors"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"stiller"
	"stiller/pkg/dbutils"
	"stiller/pkg/fsop"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"
	"strconv"

	"github.com/cespare/xxhash"
	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
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

func PostFileNew(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    type ResPayload dbutils.StillerFile

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwt.Decode(user_token)
    if loggers.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    user_id := user_tk.UserId

    multform_err := r.ParseMultipartForm(100 * MB)
    if loggers.RequestLog(multform_err, "", http.StatusBadRequest, &w) {
        return
    }

    filename := r.FormValue("stiller-name")
    if len(filename) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    abs_path := stiller.StillerConfig.FilesPath + strconv.Itoa(user_id) + "/" + filename;

    file_exists, file_err := fsop.FileExists(abs_path)
    if loggers.RequestLog(file_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if file_exists {
        loggers.RequestLog(ErrFileExists, "", http.StatusUnprocessableEntity, &w)
        return
    }

    filetype_str := r.FormValue("stiller-type")
    if len(filetype_str) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    filetype, filetype_err := strconv.ParseUint(filetype_str, 10, 8)
    if loggers.RequestLog(filetype_err, "", http.StatusNotAcceptable, &w) {
        return
    }

    if dbutils.StillerFileType(filetype) >= dbutils.UnreachableFileType {
        loggers.GenericErrLog(nil, "invalid filetype, 0 < ft < %d", dbutils.UnreachableFileType)
        return
    }

    ishashed_str := r.FormValue("stiller-hashed")
    if len(ishashed_str) != 1 {
        loggers.GenericErrLog(nil, "invalid hash '%s' expected 0|1", ishashed_str)
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
        loggers.GenericErrLog(nil, "invalid hash '%s' expected 0|1", ishashed_str)
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    form_file, _, form_file_err := r.FormFile("stiller-file")
    if loggers.RequestLog(form_file_err, "", http.StatusBadRequest, &w) {
        return
    }

    defer form_file.Close()

    body_reader := bufio.NewReader(form_file)
    if body_reader == nil {
        return
    }

    local_writer, open_err := os.Create(abs_path)
    if loggers.RequestLog(open_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer local_writer.Close()

    var hashed_writer *os.File
    var hashed_writer_err error
    if (ishashed_flag) {
        hashed_writer, hashed_writer_err = os.Create(abs_path + ".xxhash")
        if loggers.RequestLog(hashed_writer_err, "", http.StatusInternalServerError, &w) {
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
        } else if loggers.RequestLog(read_err, "", http.StatusInternalServerError, &w) {
            return
        }

        if size == 0 {
            break
        } else if size != BUFSIZE {
            normal_buf = normal_buf[:size]
        }

        new_file.Size += size
        _, write_regular_err := local_writer.Write(normal_buf)
        if loggers.RequestLog(write_regular_err, "", http.StatusInternalServerError, &w) {
            return
        }

        if (!ishashed_flag) {
            normal_buf = normal_buf[:cap(normal_buf)]
            continue
        }

        binary.NativeEndian.PutUint64(hashed_buf, xxhash.Sum64(normal_buf))
        _, write_hashed_err := hashed_writer.Write(hashed_buf)
        if loggers.RequestLog(write_hashed_err, "", http.StatusInternalServerError, &w) {
            return
        }

        normal_buf = normal_buf[:cap(normal_buf)]
    }

    push_err := dbutils.PushNewFile(&new_file)
    if loggers.RequestLog(push_err, "", http.StatusInternalServerError, &w) {
        return
    }

    new_file.Url = stiller.StillerConfig.FileBucket + strconv.Itoa(new_file.Id)

    w.WriteHeader(http.StatusOK)
    jsonexp.MarshalWrite(w, new_file, jsonexp.DefaultOptionsV2())
}


