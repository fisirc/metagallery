package handlers

import (
	"net/http"
	"stiller/pkg/netwrappers"

	"github.com/julienschmidt/httprouter"
)

func PatchGalleryEdit(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if netwrappers.CORS(w, r) {
        return
    }
}

