package main

import (
	"log"
	"net/http"
	"stiller"
	"stiller/internal/router"
)

func main() {
    new_router := router.NewStillerRouter()
    if new_router == nil {
        log.Fatalln("[ ❌ ] invalid router, exiting...")
    }

    log.Println("[ ✅ ] server started at port", stiller.StillerConfig.Port)

    log.Fatalln(http.ListenAndServe(stiller.StillerConfig.Port, new_router))
}


