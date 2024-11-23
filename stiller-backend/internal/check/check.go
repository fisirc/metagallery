package check

import (
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func IsGalleryOwner(user int, gallery int, conn *sqlite.Conn) (bool, error) {
    checker_stmt := sqlf.
        Select("owner").
            From("gallery").
        Where("owner = ?", user)

    checker_int := int(-1)
    check_exec_err := sqlitex.ExecuteTransient(conn, checker_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            checker_int = int(stmt.GetInt64("owner"))
            return nil
        },

        Args: checker_stmt.Args(),
    })

    if check_exec_err != nil {
        return false, check_exec_err
    }

    return checker_int == user, nil
}

func IsFileOwner(user int, file int, conn *sqlite.Conn) (bool, error) {
    checker_stmt := sqlf.
        Select("owner").
            From("file").
        Where("owner = ?", user)

    checker_int := int(-1)
    check_exec_err := sqlitex.ExecuteTransient(conn, checker_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            checker_int = int(stmt.GetInt64("owner"))
            return nil
        },

        Args: checker_stmt.Args(),
    })

    if check_exec_err != nil {
        return false, check_exec_err
    }

    return checker_int == user, nil
}


