package router

import (
	"net/http"
	"stiller/internal/handlers/auth/newuser"
	"stiller/internal/handlers/auth/userlogin"
	"stiller/internal/handlers/auth/userverify"
	"stiller/internal/handlers/file/filedl"
	"stiller/internal/handlers/file/filetree"
	"stiller/internal/handlers/file/patchfile"
	"stiller/internal/handlers/file/upload"
	"stiller/internal/handlers/gallery/addtemplate"

	"github.com/julienschmidt/httprouter"
)

type individualHandler struct {
    path       string
    method     string
    handlefunc httprouter.Handle
}

var routes = [...]individualHandler{
    {
        path: "/admin/template/new",
        method: http.MethodPost,
        handlefunc: addtemplate.NetHandler,
    },
    {
        path: "/gallery",
        method: http.MethodGet,
    },
    {
        path: "/gallery/new",
        method: http.MethodPost,
    },
    {
        path: "/file",
        method: http.MethodGet,
        handlefunc: filetree.Nethandler,
    },
    {
        path: "/file",
        method: http.MethodPatch,
        handlefunc: patchfile.NetHandler,
    },
    {
        path: "/file/new",
        method: http.MethodPost,
        handlefunc: upload.NetHandler,
    },
    {
        path: "/file/dl",
        method: http.MethodGet,
        handlefunc: filedl.Nethandler,
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

    _, _, flag := router.Lookup(http.MethodOptions, ind.path)
    if flag {
        router.OPTIONS(ind.path, ind.handlefunc)
    }

    fun(ind.path, ind.handlefunc)
}

func NewStillerRouter() *httprouter.Router {
    new_router := httprouter.New()

    for index := range routes {
        routerDigest(new_router, &routes[index])
    }

    return new_router
}

