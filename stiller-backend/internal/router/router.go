package router

import (
	"stiller/internal/handlers/fileretrieve"
	"stiller/internal/handlers/newuser"
	"stiller/internal/handlers/patchfile"
	"stiller/internal/handlers/upload"
	"stiller/internal/handlers/userlogin"
	"stiller/internal/handlers/userverify"

	"github.com/julienschmidt/httprouter"
)

func NewReicheRouter() *httprouter.Router {
    new_router := httprouter.New()
    new_router.POST("/file/upload", upload.NetHandler)
    new_router.PATCH("/file/update", patchfile.NetHandler)
    new_router.GET("/file/retrieveall/:user_id", fileretrieve.Nethandler)
    new_router.POST("/auth/newuser", newuser.Nethandler)
    new_router.GET("/auth/checkuser/:username", userverify.NetHandler)
    new_router.POST("/auth/login", userlogin.NetHandler)
    return new_router
}

