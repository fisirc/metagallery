package handlers

import (
	"net/http"
	"stiller/pkg/checkers"
	"stiller/pkg/dbutils"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"

	"github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
)


func PatchGallerySlot(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    type ReqPayload struct {
        Gallery     int     `json:"gallery"`
        Ref         string  `json:"ref"`
        Res         *int    `json:"res"`
        Title       *string `json:"title"`
        Description *string `json:"description"`
    }

    user_token := r.Header.Get("token")
    user_tk, token_decode_err := jwt.Decode(user_token)
    if loggers.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    rpayload := ReqPayload{}
    unmarshal_err := json.UnmarshalRead(r.Body, &rpayload, json.DefaultOptionsV2())
    if loggers.RequestLog(unmarshal_err, "", http.StatusBadRequest, &w) {
        return
    }

    new_dbconn, dbconn_err := dbutils.NewConn()
    if loggers.RequestLog(dbconn_err, "", http.StatusInternalServerError, &w) {
        return
    }

    defer dbutils.CloseConn(new_dbconn)

    user_id := user_tk.UserId
    is_owner, ownercheck_err := checkers.IsGalleryOwner(user_id, rpayload.Gallery, new_dbconn)
    if loggers.RequestLog(ownercheck_err, "", http.StatusInternalServerError, &w) {
        return
    }

    if !is_owner {
        loggers.RequestLog(nil, "this is not the owner", http.StatusForbidden, &w)
        return
    }


    var update_err error
    flag := dbutils.SlotUpdateFlag(0)

    if rpayload.Res != nil {
        flag = dbutils.UPDATE_RES
        new_val := *rpayload.Res

        update_err = dbutils.UpdateSlot(rpayload.Gallery, rpayload.Ref, flag, new_val, new_dbconn)
    }

    if rpayload.Title != nil {
        flag = dbutils.UPDATE_TITLE
        new_val := *rpayload.Title

        update_err = dbutils.UpdateSlot(rpayload.Gallery, rpayload.Ref, flag, new_val, new_dbconn)
    }

    if rpayload.Description != nil {
        flag = dbutils.UPDATE_DESCRIPTION
        new_val := *rpayload.Description

        update_err = dbutils.UpdateSlot(rpayload.Gallery, rpayload.Ref, flag, new_val, new_dbconn)
    }

    if loggers.RequestLog(update_err, "", http.StatusInternalServerError, &w) {
        return
    }

    w.WriteHeader(http.StatusOK)
}


