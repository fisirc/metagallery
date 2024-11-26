package handlers

import (
	"net/http"
	"stiller/pkg/dbutils"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"
	"strconv"

	"github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
)

func GetUserinfo(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    type ResPayload dbutils.StillerUser

    user_token := r.Header.Get("token")
    _, token_decode_err := jwt.Decode(user_token)
    if loggers.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    user_id_str := params.ByName("user_id")
    if len(user_id_str) == 0 {
        loggers.RequestLog(nil, "empty user id", http.StatusNotFound, &w)
        return
    }

    user_id, invalid_err := strconv.Atoi(user_id_str)
    if loggers.RequestLog(invalid_err, "", http.StatusBadRequest, &w) {
        return
    }


    new_dbconn, dbconn_err := dbutils.NewConn()
    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(new_dbconn)

    user_data, retrieve_err := dbutils.GetUserById(user_id, new_dbconn)
    if loggers.RequestLog(retrieve_err, "", http.StatusNotFound, &w) {
        return
    }

    json.MarshalWrite(w, user_data, json.DefaultOptionsV2())
}

