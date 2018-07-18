package model

type Search struct {
	Name    string `json:"name"`
	Privacy string `json:"privacy"`
	ID      string `json:"id"`
}

// SearchResponse represents the results returned from the api request
type SearchResponse struct {
	Data   []Search `json:"data"`
	Paging Paging   `json:"paging"`
}

// SearchPipelineResult represents the results returned from the search pipeline
type SearchPipelineResult struct {
	Result SearchResponse
	Error  error
}
