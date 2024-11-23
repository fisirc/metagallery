package main

import (
	"log"
	"net/http"
	"stiller"
	"stiller/internal/router"
	"time"
)

func main() {
    new_router := router.NewStillerRouter()
    if new_router == nil {
        log.Fatalln("[ ❌ ] invalid router, exiting...")
    }

    log.Println(
        "[ ✅ ] server started at address",
        stiller.StillerConfig.Addr,
    )

    server := &http.Server{
        Addr:         stiller.StillerConfig.Addr,
        Handler:      new_router,
        ReadTimeout:  1 * time.Second,
        WriteTimeout: 10 * time.Second,
    }

    log.Fatalln(
        server.ListenAndServe(),
    )
}


