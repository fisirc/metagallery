package fsutils

import (
	"fmt"
	"stiller"
)

func GetTemplatePath(id int) string {
    return fmt.Sprintf(
        "%s/templates/metatemplate.gay.%d",
        stiller.StillerConfig.FilesPath,
        id,
    )
}


