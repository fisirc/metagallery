package stiller

import "github.com/profclems/go-dotenv"

type ConfigType struct {
    // local directory where to retrieve/store data from/to
    Addr       string
    FilesPath  string
    DBPath     string
    Secret     []byte
    Admin      string
    BCryptCost int
}

func newConfig() *ConfigType {
    dotenv.Load()

    return &ConfigType{
        Addr: dotenv.GetString("Addr"),
        FilesPath: dotenv.GetString("FilesPath"),
        DBPath: dotenv.GetString("DBPath"),
        Secret: []byte(dotenv.GetString("Secret")),
        BCryptCost: dotenv.GetInt("BCryptCost"),
        Admin: dotenv.GetString("Admin"),
    }
}

var StillerConfig = newConfig()

