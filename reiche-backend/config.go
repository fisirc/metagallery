package stiller

type ConfigType struct {
    // local directory where to retrieve/store data from/to
    FilesPath string
    DBPath    string
}

var StillerConfig = ConfigType{
    FilesPath: "static/",
    DBPath: "db/metagallery.db",
}



