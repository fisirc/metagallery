package handlers

import (
	"bufio"
	"encoding/binary"
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"reiche"
	"reiche/internal/fsutils"
	"reiche/internal/inthash"
	"strconv"

	"github.com/cespare/xxhash"
	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
)

const BUFSIZE = 512

func UploadFile(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    filename := r.Header.Get("reiche-name")
    if len(filename) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    log.Printf("[incoming file] filename{%s}\n", filename)

    hashed_filename := inthash.HashStrStr(filename)
    abs_path := reiche.ReicheConfig.FilesPath + hashed_filename;
    log.Printf("[incoming file] abs_path{%s}\n", abs_path)
    if fsutils.FileExists(abs_path) {
        w.WriteHeader(http.StatusUnprocessableEntity)
        abs_path_err := ReqErr{
            Msg: "file hash already exists, try another name",
            Ctx: HashAlreadyExists,
        }

        GenericLog(nil, "[ error ] err{%s}\n", ReqErrCodeStr[abs_path_err.Ctx])
        jsonexp.MarshalWrite(w, abs_path_err, jsonexp.DefaultOptionsV2())
        return
    }

    filetype_str := r.Header.Get("reiche-type")
    if len(filetype_str) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    filetype, filetype_err := strconv.ParseUint(filetype_str, 10, 8)
    if RequestLog(filetype_err, "", http.StatusNotAcceptable, &w) {
        return
    }

    log.Printf("[incoming file] filetype{%d}\n", filetype)

    filehash_str := r.Header.Get("reiche-hash")
    if len(filehash_str) != 1 {
        GenericLog(nil, "invalid hash '%s' expected 0|1", filehash_str)
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
        GenericLog(nil, "invalid hash '%s' expected 0|1", filehash_str)
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    writer, open_err := os.Create(abs_path)
    if RequestLog(open_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer writer.Close()

    var hashed_writer *os.File
    var hashed_writer_err error
    if (hashed_flag) {
        hashed_writer, hashed_writer_err = os.Create(abs_path + ".hash")
        if RequestLog(hashed_writer_err, "", http.StatusInternalServerError, &w) {
            return
        }

        defer hashed_writer.Close()
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
        } else if RequestLog(read_err, "", http.StatusInternalServerError, &w) {
            return
        }

        if size == 0 {
            break
        } else if size != BUFSIZE {
            normal_buf = normal_buf[:size]
        }

        _, write_regular_err := writer.Write(normal_buf)
        if RequestLog(write_regular_err, "", http.StatusInternalServerError, &w) {
            return
        }

        if (!hashed_flag) {
            normal_buf = normal_buf[:cap(normal_buf)]
            continue
        }

        binary.NativeEndian.PutUint64(hashed_buf, xxhash.Sum64(normal_buf))
        _, write_hashed_err := hashed_writer.Write(hashed_buf)
        if RequestLog(write_hashed_err, "", http.StatusInternalServerError, &w) {
            return
        }

        normal_buf = normal_buf[:cap(normal_buf)]
    }
}


