package db

import (
	"log"
	"reiche"

	"zombiezen.com/go/sqlite"
)

func NewConn() *sqlite.Conn {
    conn, err := sqlite.OpenConn(reiche.ReicheConfig.DBPath)
    if err != nil {
        log.Fatalln(err)
        return nil
    }

    return conn
}

