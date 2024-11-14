# FS-based handlers

These endpoints are stubs used to modify any kind of file, where each file is
stored internally as follows:

```go
type StillerFileType uint8
const (
    Image StillerFileType = iota    // 0
    Video                           // 1
    Object3D                        // 3

    /* control value (not actually used inside the db) */
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
```

So each file entrance inside the database is actually a metadata block of an
actual file that lies in the server in a path defined by [the
configuration file](configuration.md##FilesPath).

