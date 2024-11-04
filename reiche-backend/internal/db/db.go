package db

import (
	"log"
	"stiller"

	"zombiezen.com/go/sqlite"
)

func NewConn() *sqlite.Conn {
    conn, err := sqlite.OpenConn(stiller.StillerConfig.DBPath)
    if err != nil {
        log.Fatalln(err)
        return nil
    }

    return conn
}

