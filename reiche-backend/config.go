package stiller

import "github.com/profclems/go-dotenv"

type ConfigType struct {
    // local directory where to retrieve/store data from/to
    FilesPath  string
    DBPath     string
    Secret     string
    BCryptCost int
}

func newConfig() *ConfigType {
    dotenv.Load()

    return &ConfigType{
        FilesPath: dotenv.GetString("FilesPath"),
        DBPath: dotenv.GetString("DBPath"),
        Secret: dotenv.GetString("Secret"),
        BCryptCost: dotenv.GetInt("BCryptCost"),
    }
}

var StillerConfig = newConfig()

