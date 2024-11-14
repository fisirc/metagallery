package router

import (
	"net/http"
	"stiller/internal/handlers/fileretrieve"
	"stiller/internal/handlers/newuser"
	"stiller/internal/handlers/patchfile"
	"stiller/internal/handlers/upload"
	"stiller/internal/handlers/userlogin"
	"stiller/internal/handlers/userverify"

	"github.com/julienschmidt/httprouter"
)

type individualHandler struct {
    path       string
    method     string
    handlefunc httprouter.Handle
}

var routes = [...]individualHandler{
    {
        path: "/file/upload",
        method: http.MethodPost,
        handlefunc: upload.NetHandler,
    },
    {
        path: "/file/update",
        method: http.MethodPatch,
        handlefunc: patchfile.NetHandler,
    },
    {
        path: "/file/retrieveall",
        method: http.MethodGet,
        handlefunc: fileretrieve.Nethandler,
    },
    {
        path: "/auth/newuser",
        method: http.MethodPost,
        handlefunc: newuser.Nethandler,
    },
    {
        path: "/auth/checkuser/:username",
        method: http.MethodGet,
        handlefunc: userverify.NetHandler,
    },
    {
        path: "/auth/login",
        method: http.MethodPost,
        handlefunc: userlogin.NetHandler,
    },
}

func routerDigest(router *httprouter.Router, ind *individualHandler) {
    var fun func(path string, handle httprouter.Handle)
    switch ind.method {
    case http.MethodPost:
        fun = router.POST
    case http.MethodGet:
        fun = router.GET
    case http.MethodHead:
        fun = router.HEAD
    case http.MethodPatch:
        fun = router.PATCH
    case http.MethodPut:
        fun = router.PUT
    }

    router.OPTIONS(ind.path, ind.handlefunc)
    fun(ind.path, ind.handlefunc)
}

func NewStillerRouter() *httprouter.Router {
    new_router := httprouter.New()

    for index := range routes {
        routerDigest(new_router, &routes[index])
    }

    return new_router
}

