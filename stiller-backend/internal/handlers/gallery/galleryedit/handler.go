package galleryedit

import (
	"net/http"
	"stiller/internal/handlers/handleutils"

	"github.com/julienschmidt/httprouter"
)

func NetHandler(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
    if handleutils.CORS(w, r) {
        return
    }

    return
}

