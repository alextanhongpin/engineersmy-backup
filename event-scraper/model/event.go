package model

type Location struct {
	City      string  `json:"city"`
	Country   string  `json:"country"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Street    string  `json:"street"`
	Zip       string  `json:"zip"`
}

type Place struct {
	ID       string   `json:"id"`
	Location Location `json:"location"`
	Name     string   `json:"name"`
}

type Event struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	StartTime   string `json:"start_time"`
	EndTime     string `json:"end_time"`
	Place       Place  `json:"place"`
}

// EventResponse represent the data obtained from the Graph API Event endpoint
type EventResponse struct {
	Data []Event `json:"data"`
}

type EventPipelineResult struct {
	Result EventResponse
	Error  error
}
