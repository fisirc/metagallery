package handlers

import (
	"log"
	"net/http"
	"stiller/pkg/dbutils"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"

	"github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
)

func GetUserinfo(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    type ResPayload dbutils.StillerUser

    token := r.Header.Get("token")
    user_tk, token_decode_err := jwt.Decode(token)
    if loggers.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    new_dbconn, dbconn_err := dbutils.NewConn()
    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(new_dbconn)

    username := params.ByName("username")
    log.Println("username:", username, len(username))
    user_data := dbutils.StillerUser{}
    var retrieve_err error

    if len(username) == 0 {
        user_data, retrieve_err = dbutils.GetUserById(user_tk.UserId, new_dbconn)
    } else {
        user_data, retrieve_err = dbutils.GetUserByUsername(username, new_dbconn)
    }

    if loggers.RequestLog(retrieve_err, "", http.StatusNotFound, &w) {
        return
    }

    user_data.Bpasswd = ""
    json.MarshalWrite(w, user_data, json.DefaultOptionsV2())
}

