package handlers

import (
	"bufio"
	"encoding/binary"
	"errors"
	"io"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"reiche"
	"reiche/internal/db"
	"reiche/internal/fsutils"
	"reiche/internal/handlers/handleutils"
	"reiche/internal/inthash"
	"strconv"

	"github.com/cespare/xxhash"
	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"zombiezen.com/go/sqlite"
)

const BUFSIZE = 512

func UploadFile(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    filename := r.Header.Get("reiche-name")
    if len(filename) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    hashed_filename := inthash.HashStrStr(filename)
    abs_path := reiche.ReicheConfig.FilesPath + hashed_filename;
    if fsutils.FileExists(abs_path) {
        w.WriteHeader(http.StatusUnprocessableEntity)
        abs_path_err := handlers.ReqErr{
            Msg: "file hash already exists, try another name",
            Ctx: handlers.HashAlreadyExists,
        }

        handlers.GenericLog(nil, "[ error ] err{%s}\n", handlers.ReqErrCodeStr[abs_path_err.Ctx])
        jsonexp.MarshalWrite(w, abs_path_err, jsonexp.DefaultOptionsV2())
        return
    }

    filetype_str := r.Header.Get("reiche-type")
    if len(filetype_str) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    filetype, filetype_err := strconv.ParseUint(filetype_str, 10, 8)
    if handlers.RequestLog(filetype_err, "", http.StatusNotAcceptable, &w) {
        return
    }

    if filetype > math.MaxUint8 {
        handlers.GenericLog(nil, "invalid filetype, 0 < ft < %d", db.Unreachable)
        return
    }

    if db.ReicheFileType(filetype) >= db.Unreachable {
        handlers.GenericLog(nil, "invalid filetype, 0 < ft < %d", db.Unreachable)
        return
    }


    filehash_str := r.Header.Get("reiche-hash")
    if len(filehash_str) != 1 {
        handlers.GenericLog(nil, "invalid hash '%s' expected 0|1", filehash_str)
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    var hashed_flag bool
    switch filehash_str {
    case "1":
        hashed_flag = true
    case "0":
        hashed_flag = false
    default:
        handlers.GenericLog(nil, "invalid hash '%s' expected 0|1", filehash_str)
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    writer, open_err := os.Create(abs_path)
    if handlers.RequestLog(open_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer writer.Close()

    var hashed_writer *os.File
    var hashed_writer_err error
    if (hashed_flag) {
        hashed_writer, hashed_writer_err = os.Create(abs_path + ".hash")
        if handlers.RequestLog(hashed_writer_err, "", http.StatusInternalServerError, &w) {
            return
        }

        defer hashed_writer.Close()
    }

    new_file := db.ReicheFile{
        Path: abs_path,
        Ext: filepath.Ext(filename),
        Type: db.ReicheFileType(filetype),
        Hashed: hashed_flag,
    }

    new_dbconn, dbconn_err := sqlite.OpenConn(reiche.ReicheConfig.DBPath)
    if handlers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    new_dbconn.Prep("insert into file")

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
        } else if handlers.RequestLog(read_err, "", http.StatusInternalServerError, &w) {
            return
        }

        if size == 0 {
            break
        } else if size != BUFSIZE {
            normal_buf = normal_buf[:size]
        }

        _, write_regular_err := writer.Write(normal_buf)
        if handlers.RequestLog(write_regular_err, "", http.StatusInternalServerError, &w) {
            return
        }

        if (!hashed_flag) {
            normal_buf = normal_buf[:cap(normal_buf)]
            continue
        }

        binary.NativeEndian.PutUint64(hashed_buf, xxhash.Sum64(normal_buf))
        _, write_hashed_err := hashed_writer.Write(hashed_buf)
        if handlers.RequestLog(write_hashed_err, "", http.StatusInternalServerError, &w) {
            return
        }

        normal_buf = normal_buf[:cap(normal_buf)]
    }
}


