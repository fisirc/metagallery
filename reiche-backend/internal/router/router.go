package router

import (
	"stiller/internal/handlers/patchfile"
	"stiller/internal/handlers/upload"

	"github.com/julienschmidt/httprouter"
)

func NewReicheRouter() *httprouter.Router {
    new_router := httprouter.New()
    new_router.POST("/upload", upload.UploadFile)
    new_router.PATCH("/newpatch", patchfile.PatchFile)
    return new_router
}

