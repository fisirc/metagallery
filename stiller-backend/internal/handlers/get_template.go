package handlers

import (
	"errors"
	"net/http"
	"stiller/pkg/dbutils"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

var (
    ErrInvalidTier = errors.New("invalid tier")
)

func GetTemplate(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    user_token := r.Header.Get("token")
    user_decoded, token_decode_err := jwt.Decode(user_token)
    if loggers.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    user_id := user_decoded.UserId
    tier_stmt := sqlf.
        Select("tier").
            From("user").
        Where("id = ?", user_id)

    dbconn, dbconn_err := dbutils.NewConn()
    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(dbconn)

    tier := dbutils.UnreachableTier
    tierexec_err := sqlitex.ExecuteTransient(dbconn, tier_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            colvalue := stmt.GetInt64("tier")
            if colvalue > int64(dbutils.UnreachableTier) {
                return ErrInvalidTier
            }

            tier = dbutils.StillerTier(colvalue)
            return nil
        },

        Args: tier_stmt.Args(),
    })

    if loggers.RequestLog(tierexec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    gettemplates_stmt := sqlf.
        Select("*").
            From("template").
        Where("tier <= ?", tier)

    templates := make([]dbutils.StillerTemplate, 0, 2)

    templateexec_err := sqlitex.ExecuteTransient(dbconn, gettemplates_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_template := dbutils.StillerTemplate{
                Id: int(stmt.GetInt64("id")),
                TierId: int(stmt.GetInt64("tier")),
                TemplateId: int(stmt.GetInt64("template")),
                Title: stmt.GetText("title"),
                Description: stmt.GetText("description"),
            }

            templates = append(templates, new_template)
            return nil
        },

        Args: gettemplates_stmt.Args(),
    })

    if loggers.RequestLog(templateexec_err, "", http.StatusInternalServerError, &w) {
        return
    }

    jsonexp.MarshalWrite(w, templates, jsonexp.DefaultOptionsV2())
}


