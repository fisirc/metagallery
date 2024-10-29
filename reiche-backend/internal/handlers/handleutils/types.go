package handlers

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

