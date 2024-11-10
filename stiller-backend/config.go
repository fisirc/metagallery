package stiller

import "github.com/profclems/go-dotenv"

type ConfigType struct {
    // local directory where to retrieve/store data from/to
    Port       string
    FilesPath  string
    DBPath     string
    Secret     []byte
    BCryptCost int
}

func newConfig() *ConfigType {
    dotenv.Load()

    return &ConfigType{
        Port: dotenv.GetString("Port"),
        FilesPath: dotenv.GetString("FilesPath"),
        DBPath: dotenv.GetString("DBPath"),
        Secret: []byte(dotenv.GetString("Secret")),
        BCryptCost: dotenv.GetInt("BCryptCost"),
    }
}

var StillerConfig = newConfig()

