package inthash

import (
	"fmt"

	"github.com/cespare/xxhash"
)

func HashStrStr(str string) string {
    bytes := []byte(str)
    return fmt.Sprintf("%d", xxhash.Sum64(bytes))
}



