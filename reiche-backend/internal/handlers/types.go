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

type ReicheFileType uint8
const (
    Image ReicheFileType = iota
    Video
    Object3D
    Unreachable
)

type ReicheFile struct {
    Path   string
    Type   ReicheFileType
    Ext    string
    Hashed bool
}

