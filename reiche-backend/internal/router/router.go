package router

import (
	"reiche/internal/handlers/upload"

	"github.com/julienschmidt/httprouter"
)

func NewReicheRouter() *httprouter.Router {
    new_router := httprouter.New()
    new_router.POST("/upload", handlers.UploadFile)
    return new_router
}

