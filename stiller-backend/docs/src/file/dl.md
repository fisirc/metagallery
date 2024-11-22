# Downloading individual Files

## Path

<div align="center">

<img src="jwt_logo.png" height="10px"/> `GET /file/dl`

</div>

## Request body

The request body is a json object of the schema:

```go
type ReqPayload struct {
    FileId int `json:"file_id"`
}
```

The owner Id will be decoded from the token that was used

## Response body

If succesful, the server will respond with the full file.

