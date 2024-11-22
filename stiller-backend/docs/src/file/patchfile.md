# Updating some file metadata

## Path

<div align="center">

<img src="jwt_logo.png" height="10px"/> `POST /file/update`

</div>

## Request body

The request body must be a json object of the schema:

```go
type ReqPayload struct {
    Id          int    `json:"id"`
    Title       string `json:"title"`
    Description string `json:"description"`
}
```

## Response body

If succesful, the server will respond with a
[OK](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) statuscode
and no body at all.

