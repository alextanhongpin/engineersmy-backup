package model

import (
	"io/ioutil"
	"net/http"
	"net/url"
	"time"

	"../perf"
)

// GraphAPI represents the schema of the Facebook Graph API
type GraphAPI struct {
	AccessToken string
}

// NewSearchURL returns a new search url with the query string as input
func (g *GraphAPI) NewSearchURL(qs map[string]string) string {
	u := url.URL{
		Scheme: "https",
		Host:   "graph.facebook.com",
		Path:   "v2.10/search",
	}
	q := u.Query()
	for k, v := range qs {
		q.Set(k, v)
	}
	q.Set("access_token", g.AccessToken)
	u.RawQuery = q.Encode()
	return u.String()
}

// Search performs a search by keyword and returns the byte data
func (g *GraphAPI) Search(keyword string) ([]byte, error) {
	// Create query string parameters
	qs := make(map[string]string)
	qs["type"] = "group"
	qs["q"] = keyword

	// Make a request
	resp, err := http.Get(g.NewSearchURL(qs))
	if err != nil {
		var b []byte
		return b, err
	}
	defer resp.Body.Close()

	return ioutil.ReadAll(resp.Body)
}

func (g *GraphAPI) NewEventURL(groupID, since string) string {
	u := url.URL{
		Scheme: "https",
		Host:   "graph.facebook.com",
		Path:   perf.Concat("v2.10/", groupID, "/events"),
	}
	qs := u.Query()
	qs.Set("access_token", g.AccessToken)
	if since == "" {
		since = time.Now().Format("2006-01-02")
	}
	qs.Set("since", since)
	u.RawQuery = qs.Encode()
	return u.String()
}

// Event returns the events that belongs to a particular facebook group
func (g *GraphAPI) Event(groupID, since string) ([]byte, error) {
	resp, err := http.Get(g.NewEventURL(groupID, since))
	if err != nil {
		var b []byte
		return b, err
	}
	defer resp.Body.Close()

	return ioutil.ReadAll(resp.Body)
}
