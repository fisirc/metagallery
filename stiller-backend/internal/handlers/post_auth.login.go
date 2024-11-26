package handlers

import (
	"net/http"
	"stiller/pkg/dbutils"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
	"golang.org/x/crypto/bcrypt"
)


func PostAuthLogin(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    type ReqPayload struct {
        Username string `json:"username"`
        Pwd      string `json:"pwd"`
    }

    type ResPayload struct {
        Token    []byte              `json:"token"`
        UserData dbutils.StillerUser `json:"userdata"`
    }

    req_payload := ReqPayload{}
    res_payload := ResPayload{}

    unmarshal_err := jsonexp.UnmarshalRead(r.Body, &req_payload, jsonexp.DefaultOptionsV2())
    if loggers.RequestLog(unmarshal_err, "", http.StatusBadRequest, &w) {
        return
    }

    new_dbconn, dbconn_err := dbutils.NewConn()
    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(new_dbconn)

    user_data, retr_err := dbutils.GetUserByUsername(req_payload.Username, new_dbconn)
    if loggers.RequestLog(retr_err, "", http.StatusNotFound, &w) {
        return
    }

    cmp_err := bcrypt.CompareHashAndPassword([]byte(user_data.Bpasswd), []byte(req_payload.Pwd))
    if loggers.RequestLog(cmp_err, "", http.StatusNotFound, &w) {
        return
    }

    new_tk := jwt.Token{
        UserId: user_data.Id,
    }

    sign_encoded, sign_err := new_tk.Encode()
    if loggers.RequestLog(sign_err, "", http.StatusInternalServerError, &w) {
        return
    }

    res_payload.UserData = user_data
    res_payload.UserData.Bpasswd = ""
    res_payload.Token = sign_encoded
    jsonexp.MarshalWrite(w, res_payload, jsonexp.DefaultOptionsV2())
}

