package db

type StillerFileType uint8
const (
    Image StillerFileType = iota
    Video
    Object3D
    Unreachable
)

/*
create table file (
    id integer unique primary key not null,
    owner integer not null references user (id),
    type integer not null references filetype (code),
    path text unique not null,
    ogname text not null,
    title text not null,
    description text not null,
    ext text not null,
    hashed integer not null,
    size real not null,
    deleted integer not null
);
*/

type StillerFile struct {
    Id          int            `json:"id"`
    OwnerId     int            `json:"ownerid"`
    Typeof      StillerFileType `json:"typeof"`
    Path        string         `json:"path"`
    Filename    string         `json:"filename"`
    Title       string         `json:"title"`
    Description string         `json:"description"`
    Ext         string         `json:"ext"`
    Hashed      bool           `json:"hashed"`
    Size        int            `json:"size"`
    Deleted     bool           `json:"deleted"`
}

