package handlers

import (
	"log"
	"net/http"
)

func GenericLog(err error, msg_fmt string, args ...any) {
    if err != nil {
        log.Printf("[ error ] err{%v}\n", err)
        return
    }

    if len(args) == 0 {
        log.Printf("[ error ] err{%s}\n", msg_fmt)
        return
    }

    log.Printf("[ error ]" + msg_fmt, args...)
}


func RequestLog(err error, msg string, status int, res *http.ResponseWriter) bool {
    if err == nil {
        return false
    }

    GenericLog(err, msg)
    (*res).WriteHeader(status)
    return true
}



