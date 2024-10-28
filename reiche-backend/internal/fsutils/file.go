package fsutils

import (
	"errors"
	"os"
)

type File struct {
    Path   string
    Type   string
    Ext    string
    Hashed bool
}

func FileNotExist(path string) bool {
    _, err := os.Stat(path)
    if err == nil {
        return false
    }

    return errors.Is(err, os.ErrNotExist)
}

