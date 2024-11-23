package dbutils

import (
	"context"
	"errors"
	"log"
	"stiller"

	"github.com/leporo/sqlf"
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

func PushNewFile(fileptr *StillerFile) error {
    new_dbconn, dbconn_err := NewConn()
    if dbconn_err != nil {
        return dbconn_err
    }

    defer CloseConn(new_dbconn)

    query_stmt := sqlf.
        InsertInto("file").
            Set("owner", fileptr.OwnerId).
            Set("type", fileptr.Typeof).
            Set("path", fileptr.Path).
            Set("filename", fileptr.Filename).
            Set("ext", fileptr.Ext).
            Set("hashed", fileptr.Hashed).
            Set("size", fileptr.Size).
            Set("deleted", fileptr.Deleted).
        Returning("id")

    query := query_stmt.String()
    query_id_res := int(-1)

    exec_err := sqlitex.ExecuteTransient(new_dbconn, query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            if stmt.ColumnType(0) == sqlite.TypeText {
                log.Println(stmt.ColumnText(0))
                return errors.New("pushfile error")
            }

            query_id_res = int(stmt.ColumnInt64(0))
            return nil
        },

        Args: query_stmt.Args(),
    })

    if query_id_res == -1 {
        return errors.New("no new file was added")
    }

    if exec_err != nil {
        return exec_err
    }

    fileptr.Id = query_id_res
    return nil
}

