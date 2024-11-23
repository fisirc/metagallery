package handleutils

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
    if len(msg) != 0 || err != nil {
        GenericLog(err, msg)
        (*res).WriteHeader(status)
        return true
    }

    return false
}



