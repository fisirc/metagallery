package handlers

import (
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
    if !fsutils.FileNotExist(abs_path) {
        w.WriteHeader(http.StatusUnprocessableEntity)
        abs_path_err := ReqErr{
            Msg: "file hash already exists, try another name",
            Ctx: HashAlreadyExists,
        }

        log.Printf("[ error ] err{%s}\n", ReqErrCodeStr[abs_path_err.Ctx])
        jsonexp.MarshalWrite(w, abs_path_err, jsonexp.DefaultOptionsV2())
        return
    }

    filetype_str := r.Header.Get("reiche-type")
    if len(filetype_str) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    filetype, filetype_err := strconv.ParseUint(filetype_str, 10, 8)
    if ReqErrorLog(filetype_err, "", http.StatusNotAcceptable, &w) {
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
    if ReqErrorLog(open_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer writer.Close()

    var hashed_writer *os.File
    var hashed_writer_err error
    if (hashed_flag) {
        hashed_writer, hashed_writer_err = os.Create(abs_path + ".hash")
        if ReqErrorLog(hashed_writer_err, "", http.StatusInternalServerError, &w) {
            return
        }
    }

    var byte_buf_mem [BUFSIZE]byte
    byte_buf := byte_buf_mem[:]
    for {
        size, read_err := r.Body.Read(byte_buf)
        if errors.Is(read_err, io.EOF) {
            break
        } else if ReqErrorLog(read_err, "", http.StatusInternalServerError, &w) {
            return
        }

        if size == 0 {
            break
        } else if size != BUFSIZE {
            byte_buf = byte_buf[:size]
            log.Println("read of size", size)
            log.Println("len of slice", len(byte_buf))
        }

        _, write_regular_err := writer.Write(byte_buf)
        if ReqErrorLog(write_regular_err, "", http.StatusInternalServerError, &w) {
            return
        }


        if (!hashed_flag) {
            byte_buf = byte_buf[:cap(byte_buf)]
            continue
        }

        hashedbuf := make([]byte, 8)
        binary.NativeEndian.PutUint64(hashedbuf, xxhash.Sum64(byte_buf))

        _, write_hashed_err := hashed_writer.Write(hashedbuf)
        if ReqErrorLog(write_hashed_err, "", http.StatusInternalServerError, &w) {
            return
        }

        byte_buf = byte_buf[:cap(byte_buf)]
    }
}


