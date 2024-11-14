# Login

## Path

<div align="center">

`POST /auth/login`

</div>

## Request body

A json object of the type:

```go
type ReqPayload struct {
    Username string `json:"username"`
    Pwd      string `json:"pwd"`
}
```

## Response body

If succesful, the server will respond with a single unformatted token string,
it's the caller's responsibility to store this token as it is needed for most
operations.

