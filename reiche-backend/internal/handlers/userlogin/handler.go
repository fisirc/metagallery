package userlogin

import (
	"net/http"
	"stiller/internal/handlers/handleutils"

	jsonexp "github.com/go-json-experiment/json"
	"github.com/julienschmidt/httprouter"
)


func NetHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    type ReqPayload struct {
        Username string `json:"username"`
        Pwd      string `json:"pwd"`
    }

    payload := ReqPayload{}
    unmarshal_err := jsonexp.UnmarshalRead(r.Body, &payload, jsonexp.DefaultOptionsV2())
    if handleutils.RequestLog(unmarshal_err, "", http.StatusBadRequest, &w) {
        return
    }
}

