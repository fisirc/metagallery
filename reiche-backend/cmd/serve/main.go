package main

import (
	"log"
	"net/http"
	"reiche/internal/router"
)

func main() {
    new_router := router.NewReicheRouter()
    if new_router == nil {
        log.Fatalln("[ ❌ ] invalid router, exiting...")
    }

    log.Println("[ ✅ ] server started")

    log.Fatalln(http.ListenAndServe(":6969", new_router))
}


