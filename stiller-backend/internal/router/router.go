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
	"stiller/internal/handlers/gallery/addgallery"
	"stiller/internal/handlers/gallery/galleryedit"
	"stiller/internal/handlers/gallery/gallerytree"
	"stiller/internal/handlers/template/addtemplate"
	"stiller/internal/handlers/template/gettemplate"

	"github.com/julienschmidt/httprouter"
)

type individualHandler struct {
    path       string
    method     string
    handlefunc httprouter.Handle
}

var routes = [...]individualHandler{
    {
        path: "/template",
        method: http.MethodGet,
        handlefunc: gettemplate.NetHandler,
    },
    {
        path: "/template/new",
        method: http.MethodPost,
        handlefunc: addtemplate.NetHandler,
    },
    {
        path: "/gallery",
        method: http.MethodGet,
        handlefunc: gallerytree.NetHandler,
    },
    {
        path: "/gallery/edit",
        method: http.MethodPatch,
        handlefunc: galleryedit.NetHandler,
    },
    {
        path: "/gallery/new",
        method: http.MethodPost,
        handlefunc: addgallery.NetHandler,
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
        path: "/file/dl/:file_id",
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

    handler, _, _ := router.Lookup(http.MethodOptions, ind.path)
    if handler == nil {
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

