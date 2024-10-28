package fsutils

import (
	"errors"
	"os"
)

func FileExists(path string) bool {
    _, err := os.Stat(path)
    if err == nil {
        return true
    }

    return !errors.Is(err, os.ErrNotExist)
}

