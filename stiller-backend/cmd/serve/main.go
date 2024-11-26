package main

import (
	"log"
	"net/http"
	"os"
	"stiller"
	"stiller/internal/router"
	"stiller/pkg/loggers"
	"time"
)

func main() {
    new_router := router.NewStillerRouter()
    if new_router == nil {
        loggers.GenericErrLog(nil, "invalid router, exiting...")
        os.Exit(-1)
    }

    log.Println(
        "[ok] server started at address",
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


