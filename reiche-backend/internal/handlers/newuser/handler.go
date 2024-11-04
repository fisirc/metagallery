package newuser

import (
	"net/http"
	"stiller"
	"stiller/internal/db"
	"stiller/internal/handlers/handleutils"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"golang.org/x/crypto/bcrypt"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)


func Nethandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    type ReqPayload struct {
        AvatarId    int    `json:"avatar_id"`
        TierId      int    `json:"tier_id"`
        Username    string `json:"username"`
        Mail        string `json:"mail"`
        Passwd      string `json:"pwd"`
    }

    type ResPayload struct {
        NewId int `json:"newid"`
    }

    rpayload := ReqPayload{}
    unmarshal_err := jsonexp.UnmarshalRead(r.Body, &rpayload, jsonexp.DefaultOptionsV2())
    if handleutils.RequestLog(unmarshal_err, "", http.StatusBadRequest, &w) {
        return
    }

    passwdbytes := []byte(rpayload.Passwd)
    bcrypt_pwd, bcrypt_err := bcrypt.GenerateFromPassword(passwdbytes, stiller.StillerConfig.BCryptCost)
    if handleutils.RequestLog(bcrypt_err, "", http.StatusInternalServerError, &w) {
        return
    }

    new_user := db.StillerUser{
        AvatarId: rpayload.AvatarId,
        TierId: rpayload.TierId,
        Displayname: rpayload.Username,
        Username: rpayload.Username,
        Mail: rpayload.Mail,
        Bpasswd: string(bcrypt_pwd),
    }

    new_dbconn, dbconn_err := sqlite.OpenConn(stiller.StillerConfig.DBPath)
    if handleutils.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer new_dbconn.Close()

    query := `insert into user (avatar, tier, displayname, username, mail, bpasswd)
        values
            (?1, ?2, ?3, ?4, ?5, ?6)
        returning
            id;`

    new_id := int(-1)
    sqlitex.ExecuteTransient(new_dbconn, query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_id = stmt.ColumnInt(0)
            return nil
        },

        Args: []any{
            new_user.AvatarId,
            new_user.TierId,
            new_user.Username,
            new_user.Displayname,
            new_user.Mail,
            new_user.Bpasswd,
        },
    })

    if new_id == -1 {
        handleutils.GenericLog(nil, "no new user was created")
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    respayload := ResPayload{
        NewId: new_id,
    }

    w.WriteHeader(http.StatusOK)
    jsonexp.MarshalWrite(w, respayload, jsonexp.DefaultOptionsV2())
}




