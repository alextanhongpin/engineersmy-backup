package model

type Cursor struct {
	Before string `json:"before"`
	After  string `json:"after"`
}

type Paging struct {
	Cursors Cursor `json:"cursors"`
	Next    string `json:"next"`
}
