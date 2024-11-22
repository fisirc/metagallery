package templates

type MetatemplateSlot struct {
    Id       string      `json:"id"`
    Type     string      `json:"type"`
    Props    interface{} `json:"props"`
    Vertices [][]float64 `json:"v"`
}


