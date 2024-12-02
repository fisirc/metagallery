package router

import (
	"net/http"
	"stiller/internal/handlers"

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
        handlefunc: handlers.GetTemplate,
    },
    {
        path: "/template/info/:template_id/:field",
        method: http.MethodGet,
        handlefunc: handlers.GetTemplateInfo,
    },
    {
        path: "/template/new",
        method: http.MethodPost,
        handlefunc: handlers.PostTemplateNew,
    },
    {
        path: "/gallery/:slug",
        method: http.MethodGet,
        handlefunc: handlers.GetGalleryDetail,
    },
    {
        path: "/gallery",
        method: http.MethodGet,
        handlefunc: handlers.GetGallery,
    },
    {
        path: "/galleryall",
        method: http.MethodGet,
        handlefunc: handlers.GetAllGallery,
    },
    {
        path: "/gallery/new",
        method: http.MethodPost,
        handlefunc: handlers.PostGalleryNew,
    },
    {
        path: "/gallery/edit",
        method: http.MethodPatch,
        handlefunc: handlers.PatchGalleryEdit,
    },
    {
        path: "/gallery/slot",
        method: http.MethodPatch,
        handlefunc: handlers.PatchGallerySlot,
    },
    {
        path: "/gallerydel/:gallery_slug",
        method: http.MethodGet,
        handlefunc: handlers.GetGalleryDel,
    },
    {
        path: "/file",
        method: http.MethodGet,
        handlefunc: handlers.GetFile,
    },
    {
        path: "/file",
        method: http.MethodPatch,
        handlefunc: handlers.PatchFile,
    },
    {
        path: "/file/new",
        method: http.MethodPost,
        handlefunc: handlers.PostFileNew,
    },
    {
        path: "/file/dl/:file_id/",
        method: http.MethodGet,
        handlefunc: handlers.GetFileDl,
    },
    {
        path: "/file/del/:file_id",
        method: http.MethodGet,
        handlefunc: handlers.GetFileDel,
    },
    {
        path: "/auth/newuser",
        method: http.MethodPost,
        handlefunc: handlers.PostAuthNewuser,
    },
    {
        path: "/auth/login",
        method: http.MethodPost,
        handlefunc: handlers.PostAuthLogin,
    },
    {
        path: "/auth/profile/",
        method: http.MethodGet,
        handlefunc: handlers.GetUserinfo,
    },
    {
        path: "/auth/profile/:username",
        method: http.MethodGet,
        handlefunc: handlers.GetUserinfo,
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

