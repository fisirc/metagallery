package dbutils

import (
	"context"
	"log"
	"stiller"

	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func newPool() *sqlitex.Pool {
    pool, err := sqlitex.NewPool(stiller.StillerConfig.DBPath, sqlitex.PoolOptions{})
    if err != nil {
        log.Panicln(err)
    }

    return pool
}

var db_pool = newPool()

func NewConn() (*sqlite.Conn, error) {
    return db_pool.Take(context.Background())
}

func CloseConn(conn *sqlite.Conn) {
    db_pool.Put(conn)
}

