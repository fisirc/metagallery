package tarutils

import (
	"archive/tar"
	"errors"
	"io"
	"os"
	"stiller/internal/fsutils"
)

func TarPushFile(tarf *tar.Writer, file io.Reader, filename string, filesize int64) error {
    tar_header := &tar.Header{
        Name: filename,
        Mode: 0600,
        Size: filesize,
        Format: tar.FormatGNU,
    }

    writeheader_err := tarf.WriteHeader(tar_header)
    if writeheader_err != nil {
        return writeheader_err
    }

    const BUFSIZE = 512
    stackbuf := [BUFSIZE]byte{}
    buf := stackbuf[:]
    for {
        size, read_err := file.Read(buf)
        if errors.Is(read_err, io.EOF) {
            break
        } else if read_err != nil {
            return read_err
        }

        if size == 0 {
            break
        } else if size != BUFSIZE {
            buf = buf[:size]
        }

        _, write_err := tarf.Write(buf)
        if write_err != nil {
            return write_err
        }
    }

    return nil
}


func TarGetTemplateReader(id int) (io.Reader, error) {
    path := fsutils.GetTemplatePath(id)
    file, open_err := os.Open(path)
    if open_err != nil {
        return nil, open_err
    }

    tar_reader := tar.NewReader(file)
    _, read_err := tar_reader.Next()
    if read_err != nil {
        return nil, read_err
    }

    return tar_reader, nil
}

