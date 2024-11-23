package templates

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

