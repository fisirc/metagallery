# Uploading Files

## Path

<div align="center">

<img src="jwt_logo.png" height="10px"/> `POST /file/upload`

</div>

## Request body

Now, the payload itself is not a "StillerFile" object but a multipart form body
in the shape of:

|   Form field name     |   form field type     |
|-----------------------|-----------------------|
|   stiller-name        |       `?string`       |
|   stiller-type        |       `u8`            |
|   stiller-file        |       `Binary File`   |
|   stiller-hashed      |       `?u2`           |

### stiller-name

This is the name that the file will use when stored both in the server local
filesytem and in the database metadata.

*Values*:
- `allowed`: Any string
- `default`: If no string is given, or if a 0-length string is given, the system
  will use the filename from the multipart form metadata itself. If, for some
  reason, the form metadata also return a 0-length string then the request
  will fail.

### stiller-type

*warning: this is not related to the file's MIME-type*

This is the in-database type of the file metadata entry

*Values*:
- `allowed`: One of the allowed [`filetype`](/files.md) identifiers
- `default`: Non optional field

### stiller-file

This is a raw binary file capped at 100mb size.

*Values*:
- `allowed`: A raw binary file
- `default`: Non optional field

### stiller-hashed

This is a binary number (`0 | 1`) that gets interpret as a boolean which also
gets used to decide if the system must or must not produce a hash of the file
(may secure files but may slow down file retrieval too).

*Values*:
- `allowed`: `0 | 1`
- `default`: by default, `0` is assigned

## Response body

If succesful, the server will respond with the following schema, where the `id`
is that of the newly created file:

```go
type ResPayload struct {
    Id int `json:"id"`
}
```


