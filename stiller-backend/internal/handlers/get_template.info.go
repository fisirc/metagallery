package handlers

import (
	"log"
	"net/http"
	"stiller/pkg/loggers"
	"stiller/pkg/netwrappers"
	"stiller/pkg/templates"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

var ContentTypes = map[string]string {
    "data": "application/json",
    "scene": "model/gltf-binary",
    "thumbnail": "image/png",
    "topview": "image/svg+xml",
}

func GetTemplateInfo(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if netwrappers.CORS(w, r) {
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
        w.Header().Set("Content-Type", ContentTypes[metatemplate_field])
        templates.WriteTemplateSubfile(w, metatemplate_field, template_id)
        // if fieldnamae is topview add header image/svg+xml
        w.Header().Set("Content-Type", ContentTypes[metatemplate_field])
        log.Println("[info] Adding content-type ", ContentTypes[metatemplate_field])

    default:
        loggers.RequestLog(nil, "not a valid field", http.StatusNotFound, &w)
        return
    }
    w.Header().Set("Content-Type", ContentTypes[metatemplate_field])
}


