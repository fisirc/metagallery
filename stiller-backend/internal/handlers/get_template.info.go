package handlers

import (
	"net/http"
	"stiller/pkg/jwt"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"
	"stiller/pkg/templates"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

func GetTemplateInfo(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }

    user_token := r.Header.Get("token")
    _, token_decode_err := jwt.Decode(user_token)
    if loggers.RequestLog(token_decode_err, "", http.StatusUnauthorized, &w) {
        return
    }

    template_id_str := params.ByName("template_id")
    template_id, template_id_err := strconv.Atoi(template_id_str)
    if loggers.RequestLog(template_id_err, "", http.StatusBadRequest, &w) {
        return
    }

    metatemplate_field := params.ByName("field")
    switch metatemplate_field {
    case "data", "scene", "thumbnail", "topview":
        templates.WriteTemplateSubfile(w, metatemplate_field, template_id)

    default:
        loggers.RequestLog(nil, "not a valid field", http.StatusNotFound, &w)
        return
    }
}


