package netwrappers

import (
	"net/http"
)

func CORS(w http.ResponseWriter, r *http.Request) bool {
    w.Header().Add("Access-Control-Allow-Origin", "*")
    w.Header().Add("Access-Control-Allow-Credentials", "true")
    w.Header().Add("Access-Control-Expose-Headers", "*")

    if r.Method == http.MethodOptions {
        w.Header().Add("Access-Control-Allow-Methods", "*")
        w.Header().Add("Access-Control-Allow-Headers", "*")
        w.Header().Add("Access-Control-Max-Age", "86400")

        w.WriteHeader(http.StatusOK)
        return true
    }

    return false
}



