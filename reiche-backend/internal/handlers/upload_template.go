package handlers

import (
	"encoding/binary"
	"io"
	"log"
	"net/http"
	"os"
	"reiche"
	"reiche/internal/inthash"

	"github.com/cespare/xxhash"
	"github.com/julienschmidt/httprouter"
)

const BUFSIZE = 512

var ReicheTypes = map[string]struct{}{
    "3d-object": {},
    "image": {},
    "video": {},
}

var BoolMap = map[string]bool {
    "true": true,
    "false": false,
}

func UploadFile(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    filename := r.Header.Get("reiche-name")
    if len(filename) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    hashed_filename := inthash.HashStrStr(filename)
    abs_path := reiche.ReicheConfig.FilesPath + hashed_filename;

    filetype := r.Header.Get("reiche-type")
    if len(filetype) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    if _, ok := ReicheTypes[filetype]; !ok {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    filehash_str := r.Header.Get("reiche-hash")
    if len(filetype) == 0 {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    var hashed_writer *os.File
    var hashed_writer_err error
    hashed_flag, ok := BoolMap[filehash_str];
    if !ok {
        w.WriteHeader(http.StatusNotAcceptable)
        return
    }

    writer, open_err := os.Create(abs_path)
    defer writer.Close()
    if open_err != nil {
        log.Println("[ 😥 ] open_err:", open_err)
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    if (hashed_flag) {
        hashed_writer, hashed_writer_err = os.Create(abs_path + ".hash")
        if hashed_writer_err != nil {
            log.Println("[ 😥 ] hashed_writer_err:", hashed_writer_err)
            w.WriteHeader(http.StatusInternalServerError)
            return
        }
    }

    byte_buf := make([]byte, BUFSIZE)
    for {
        size, read_err := r.Body.Read(byte_buf)
        if size == 0 {
            break
        } else if size != BUFSIZE {
            byte_buf = byte_buf[0:size]
        }

        if read_err == io.EOF {
            break
        } else if read_err != nil {
            log.Println("[ 😥 ] read_err:", read_err)
            w.WriteHeader(http.StatusInternalServerError)
            return
        }

        _, write_regular_err := writer.Write(byte_buf)
        if write_regular_err != nil {
            log.Println("[ 😥 ] write_regular_err:", write_regular_err)
            w.WriteHeader(http.StatusInternalServerError)
            return
        }

        if (!hashed_flag) {
            continue
        }

        hashedbuf := make([]byte, 8)
        binary.NativeEndian.PutUint64(hashedbuf, xxhash.Sum64(byte_buf))

        _, write_hashed_err := hashed_writer.Write(hashedbuf)
        if write_hashed_err != nil {
            log.Println("[ 😥 ] write_hashed_err:", write_hashed_err)
            w.WriteHeader(http.StatusInternalServerError)
            return
        }
    }
}


