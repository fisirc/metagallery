package dbutils

type StillerFileType uint8
const (
    Image StillerFileType = iota
    Video
    Object3D
    Unreachable
)

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

type StillerUser struct {
    Id          int    `json:"id"`
    AvatarId    int    `json:"avatarid"`
    TierId      int    `json:"tierid"`
    Displayname string `json:"displayname"`
    Username    string `json:"username"`
    Mail        string `json:"mail"`
    Bpasswd     string `json:"bpasswd"`
}

