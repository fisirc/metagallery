package dbutils

import (
	"stiller/pkg/templates"

	"zombiezen.com/go/sqlite"
)

type StillerFileType uint8
const (
    Image StillerFileType = iota
    Video
    Object3D
    Metatemplate
    UnreachableFileType
)

type StillerFile struct {
    Id          int             `json:"id"`
    OwnerId     int             `json:"ownerid"`
    Typeof      StillerFileType `json:"typeof"`
    Path        string          `json:"path"`
    Url         string          `json:"url"`
    Filename    string          `json:"filename"`
    Title       string          `json:"title"`
    Description string          `json:"description"`
    Ext         string          `json:"ext"`
    Hashed      bool            `json:"hashed"`
    Size        int             `json:"size"`
    Deleted     bool            `json:"deleted"`
}

type StillerTier uint8
const (
    Free StillerTier = iota
    VanGogh
    Picasso
    UnreachableTier
)

type StillerUser struct {
    Id          int         `json:"id"`
    TierId      StillerTier `json:"tierid"`
    Displayname string      `json:"displayname"`
    Username    string      `json:"username"`
    Mail        string      `json:"mail"`
    Bpasswd     string      `json:"bpasswd,omitempty"`
}

func (su *StillerUser) FromStmt(stmt *sqlite.Stmt) {
    *su = StillerUser{
        Id: int(stmt.GetInt64("id")),
        TierId: StillerTier(stmt.GetInt64("tier")),
        Displayname: stmt.GetText("displayname"),
        Username: stmt.GetText("username"),
        Mail: stmt.GetText("mail"),
        Bpasswd: stmt.GetText("bpasswd"),
    }
}

type StillerTemplateBlock struct {
    Id          int     `json:"id"`
    TemplateId  int     `json:"template"`
    Posx        float64 `json:"posx"`
    Posy        float64 `json:"posy"`
    Direction   float64 `json:"direction"`
}

type StillerMetatemplatefile struct {
    Id   int
    Path string
}

type StillerTemplate struct {
    Id          int    `json:"id"`
    TierId      int    `json:"tier"`
    TemplateId  int    `json:"templatefile"`
    Title       string `json:"title"`
    Description string `json:"description"`
}

func (st *StillerTemplate) FromStmt(stmt *sqlite.Stmt) {
    *st = StillerTemplate{
        Id: int(stmt.GetInt64("id")),
        TierId: int(stmt.GetInt64("tier")),
        TemplateId: int(stmt.GetInt64("templatefile")),
        Title: stmt.GetText("title"),
        Description: stmt.GetText("description"),
    }
}

type StillerGallerySlot struct {
    templates.MetatemplateSlot
    RefId       string `json:"ref"`
    ResId       int    `json:"res"`
    Title       string `json:"title"`
    Description string `json:"description"`
}

type StillerGalleryData struct {
    Origin []float64            `json:"origin"`
    Slots  []StillerGallerySlot `json:"slots"`
}

type StillerGallery struct {
    Id           int                  `json:"id"`
    Title        string               `json:"title"`
    Description  string               `json:"description"`
    OwnerId      int                  `json:"ownerid"`
    TemplateId   int                  `json:"templateid"`
    Slug         string               `json:"slug"`
    Data         StillerGalleryData   `json:"slots"`
}

