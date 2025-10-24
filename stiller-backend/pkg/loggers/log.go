package loggers

import (
	"log"
	"net/http"
)

// Error types
type ReqErrCode uint8
const (
    HashAlreadyExists ReqErrCode = iota
)

var ReqErrCodeStr = [...]string{
    "HashAlreadyExists",
}

type ReqErr struct {
    Msg string `json:"msg"`
    Ctx ReqErrCode `json:"ctx"`
}

func GenericLog(title string, err error, msg_fmt string, args ...any) {
    if err != nil {
        log.Printf("[%s] %v\n", title, err)
        return
    }

    if len(args) == 0 {
        log.Printf("[%s] %s\n", title, msg_fmt)
        return
    }

    log.Printf(msg_fmt, args...)
}

func GenericErrLog(err error, msg_fmt string, args ...any) {
    GenericLog("error", err, msg_fmt, args...)
}

func GenericOkLog(err error, msg_fmt string, args ...any) {
    if err != nil {
        log.Printf("[error] %v\n", err)
        return
    }

    if len(args) == 0 {
        log.Printf("[error] %s\n", msg_fmt)
        return
    }

    log.Printf("[error]" + msg_fmt, args...)
}

func RequestLog(err error, msg string, status int, res *http.ResponseWriter) bool {
    if err != nil {
        GenericErrLog(err, err.Error())
    }
    if len(msg) != 0 {
        (*res).WriteHeader(status)
        return true
    }

    return false
}



