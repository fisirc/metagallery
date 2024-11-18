package dbutils

type StillerFileType uint8
const (
    Image StillerFileType = iota
    Video
    Object3D
    Unreachable
)

type StillerFile struct {
    Id          int             `json:"id"`
    OwnerId     int             `json:"ownerid"`
    Typeof      StillerFileType `json:"typeof"`
    Path        string          `json:"path"`
    Filename    string          `json:"filename"`
    Title       string          `json:"title"`
    Description string          `json:"description"`
    Ext         string          `json:"ext"`
    Hashed      bool            `json:"hashed"`
    Size        int             `json:"size"`
    Deleted     bool            `json:"deleted"`
}

type StillerUser struct {
    Id          int    `json:"id"`
    TierId      int    `json:"tierid"`
    Displayname string `json:"displayname"`
    Username    string `json:"username"`
    Mail        string `json:"mail"`
    Bpasswd     string `json:"bpasswd"`
}

type StillerTemplateBlock struct {
    Id          int     `json:"id"`
    TemplateId  int     `json:"template"`
    Posx        float64 `json:"posx"`
    Posy        float64 `json:"posy"`
    Direction   float64 `json:"direction"`
}

type StillerTemplate struct {
    Id          int    `json:"id"`
    TierId      int    `json:"tier"`
    ThumbnailId int    `json:"thumbnail"`
    TemplateId  int    `json:"templatefile"`
    Title       string `json:"title"`
    Description string `json:"description"`
}

type SlotType uint8
const (
    D2 SlotType = iota
    D3
)

type StillerSlot struct {
    Ref  int       `json:"ref"`
    Pos  []float64 `json:"pos"`
    Type SlotType  `json:"type"`
}


