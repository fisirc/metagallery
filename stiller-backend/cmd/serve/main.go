package main

import (
	"log"
	"net/http"
	"stiller/internal/router"
)

func main() {
    new_router := router.NewStillerRouter()
    if new_router == nil {
        log.Fatalln("[ ❌ ] invalid router, exiting...")
    }

    log.Println("[ ✅ ] server started")

    log.Fatalln(http.ListenAndServe(":6969", new_router))
}


