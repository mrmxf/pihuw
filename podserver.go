// Copyright ©2022-2025 Mr MXF   info@mrmxf.com
// BSD-3-Clause License   https://opensource.org/license/bsd-3-clause/

package main

// package main is a simple static web server that serves a hugo site.
//

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/mrmxf/clog/gommi"
	"github.com/mrmxf/clog/slogger"
)

// the default port to serve data is 8080
var Port = "8080"
var urlPrefix="/"
var mountPath="public"

func main() {
	r, _ := gommi.Bare()
	r.NewFileServer(urlPrefix, mountPath)

	// run the server in a thread
	slog.Info(fmt.Sprintf("Listening on port %s", Port))
	http.ListenAndServe("0.0.0.0:"+Port, r)
}

func init() {
	slogger.UsePrettyLogger(slog.LevelError)
	containerDataPath, insideKo := os.LookupEnv("KO_DATA_PATH")
	if insideKo {
		mountPath = containerDataPath
	}
}
