package router

import (
	"stiller/internal/handlers/fileretrieve"
	"stiller/internal/handlers/newuser"
	"stiller/internal/handlers/patchfile"
	"stiller/internal/handlers/upload"

	"github.com/julienschmidt/httprouter"
)

func NewReicheRouter() *httprouter.Router {
    new_router := httprouter.New()
    new_router.POST("/upload", upload.NetHandler)
    new_router.PATCH("/patchfile", patchfile.NetHandler)
    new_router.GET("/fileretrieve/:user_id", fileretrieve.Nethandler)
    new_router.POST("/newuser", newuser.Nethandler)
    return new_router
}

