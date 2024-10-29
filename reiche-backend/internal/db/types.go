package db

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

