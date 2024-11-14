# Server configuration

The server configuration is done via a single globally available variable which
type is structured as follows:

```go
type ConfigType struct {
    Port       string /* local port where the service will be deployed at */
    FilesPath  string /* local directory where to retrieve/store data from/to */
    DBPath     string /* local static path of the sqlite database file */
    Secret     []byte /* secret to be used by token generation functions and
                         other encrypted necesities */
    BCryptCost int    /* bcrypt password encryption cost */
}
```

It's build upon a `.env` file which is schemed just the same way as the type.
For example:

```sh
Port=":6969"
FilesPath="static/"
DBPath="db/metagallery.db"
Secret="whatever secret"
BCryptCost=99
```

