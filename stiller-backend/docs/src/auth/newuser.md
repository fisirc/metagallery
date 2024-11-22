# Creating a new user

## Path

<div align="center">

`POST /auth/newuser`

</div>

## Request body

The request body is a json object of the schema:

```go
type ReqPayload struct {
    AvatarId    int    `json:"avatar_id"`
    TierId      int    `json:"tier_id"`
    Username    string `json:"username"`
    Mail        string `json:"mail"`
    Passwd      string `json:"pwd"`
}
```

The owner Id will be decoded from the token that was used and the `avatar_id`
field represents a `file::id` value, so the caller probably wants to use
`/file/new` before calling this endpoint.

Adding an avatar is totally optional.

## Response body

If succesful, the server will respond with the auth token to be used in future
requests.

