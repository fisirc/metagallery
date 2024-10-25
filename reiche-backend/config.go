package reiche

type ConfigType struct {
    // local directory where to retrieve/store data from/to
    FilesPath string
}

var ReicheConfig = ConfigType{
    FilesPath: "./static/",
}



