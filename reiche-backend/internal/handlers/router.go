package handlers

import "github.com/julienschmidt/httprouter"

func NewReicheRouter() *httprouter.Router {
    new_router := httprouter.New()
    new_router.POST("/upload", UploadFile)
    return new_router
}

