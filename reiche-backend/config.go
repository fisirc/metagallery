package reiche

type ConfigType struct {
    // local directory where to retrieve/store data from/to
    FilesPath string
    DBPath    string
}

var ReicheConfig = ConfigType{
    FilesPath: "static/",
    DBPath: "db/metagallery.db",
}



