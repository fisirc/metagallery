package dbutils

import (
	"context"
	"log"
	"stiller"

	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func newPool() *sqlitex.Pool {
    pool, err := sqlitex.NewPool(stiller.StillerConfig.DBPath, sqlitex.PoolOptions{
        PrepareConn: func(conn *sqlite.Conn) error {
            stmt, _, err := conn.PrepareTransient("PRAGMA foreign_keys = ON;")
            _, row_ret_err := stmt.Step()
            if row_ret_err != nil {
                return row_ret_err
            }

            return err
        },
    })
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

