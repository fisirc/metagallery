package templates

import (
	"archive/tar"
	"bufio"
	"errors"
	"io"
	"os"
	"stiller/pkg/fsop"

	jsonexp "github.com/go-json-experiment/json"
)

type MetatemplateSlot struct {
    Ref      string      `json:"ref"`
    Type     string      `json:"type"`
    Props    interface{} `json:"props"`
    Vertices [][]float64 `json:"v"`
}

type MetatemplateData struct {
    Origin []float64          `json:"origin"`
    Slots  []MetatemplateSlot `json:"slots"`
}

var (
    ErrNoTemplate = errors.New("no matching template was found")
)

var Filenames = map[string]string {
    "data": "data.json",
    "scene": "scene.glb",
    "thumbnail": "thumbnail.png",
    "topview": "topview.svg",
}

var (
    ErrNoTemplatefile = errors.New("no templatefile was found")
)

func WriteTemplateSubfile(w io.Writer, fieldname string, template int) error {
    file_path := fsop.GetTemplatePath(template)
    file_exists, file_err := fsop.FileExists(file_path)
    if file_err != nil {
        return file_err
    }

    if !file_exists {
        return ErrNoTemplate
    }

    tar_file, tar_err := os.Open(file_path)
    if tar_err != nil {
        return tar_err
    }

    tar_reader := tar.NewReader(tar_file)
    for {
        tar_header, tar_fmt_err := tar_reader.Next()
        if tar_fmt_err != nil {
            return tar_fmt_err
        }

        if tar_header.Name == Filenames[fieldname] {
            break
        }
    }

    buf_tar_reader := bufio.NewReader(tar_reader)
    buf_tar_reader.WriteTo(w)
    return nil
}

func GetTemplateData(template int) (MetatemplateData, error) {
    ret := MetatemplateData{}

    file_path := fsop.GetTemplatePath(template)
    file_exists, file_err := fsop.FileExists(file_path)
    if file_err != nil {
        return MetatemplateData{}, file_err
    }

    if !file_exists {
        return MetatemplateData{}, ErrNoTemplate
    }

    tar_file, tar_err := os.Open(file_path)
    if tar_err != nil {
        return MetatemplateData{}, tar_err
    }

    tar_reader := tar.NewReader(tar_file)
    for {
        tar_header, tar_fmt_err := tar_reader.Next()
        if tar_fmt_err != nil {
            return MetatemplateData{}, tar_fmt_err
        }

        if tar_header.Name == "data.json" {
            break
        }
    }

    buf_tar_reader := bufio.NewReader(tar_reader)
    jsonexp.UnmarshalRead(buf_tar_reader, &ret, jsonexp.DefaultOptionsV2())

    tar_file.Close()
    return ret, nil
}

