package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/robfig/cron"
)

// File represents the github payload that contains the sha field
type File struct {
	SHA     string `json:"sha"`
	Path    string `json:"path"`
	Message string `json:"message"`
	Content string `json:"content"`
	Branch  string `json:"branch"`
}

// Events represents the data that is obtained from the event endpoint
type Events struct {
	Data []Event `json:"data"`
}

// Event represents the individual event fields
type Event struct {
	CreatedAt time.Time `json:"created_at"`
}

var deltaTimestamp time.Time
var counter int64

func backup(fileURL, eventsURL, token string) (bool, error) {
	file, err := fetchFileSHA(fileURL)
	if err != nil {
		return false, fmt.Errorf("fetchFileSHA: %v", err)
	}
	hasUpdate, err := validateUpdate(eventsURL)
	if err != nil {
		return false, fmt.Errorf("validateUpdate: %v", err)
	}
	if !hasUpdate {
		return false, nil
	}
	res, err := fetchEventsAsBase64(eventsURL)
	if err != nil {
		return false, fmt.Errorf("fetchEventsAsBase64: %v", err)
	}
	newFile := File{
		SHA:     file.SHA,
		Path:    "event.json",
		Message: fmt.Sprintf("chore: backup event.json on %s", time.Now().Format("2006-01-02")),
		Content: res,
		Branch:  "master",
	}
	if err := commitFile(fileURL, token, newFile); err != nil {
		return false, fmt.Errorf("commitFile: %v", err)
	}
	return true, nil
}

func main() {
	fileURL := os.Getenv("FILE_URL")
	eventsURL := os.Getenv("EVENTS_URL")
	token := os.Getenv("GITHUB_TOKEN")
	port := os.Getenv("PORT")

	if fileURL == "" || eventsURL == "" || token == "" || port == "" {
		log.Fatal("one or more of the required environment variables are missing")
	}

	c := cron.New()
	c.AddFunc("@hourly", func() {
		ok, err := backup(fileURL, eventsURL, token)
		if err != nil {
			log.Println(err)
			return
		}
		if ok == true {
			counter++
			log.Printf("backup completed on %s\n", time.Now().Format("2006-01-02"))
		}
	})
	c.Start()

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"counter": %d}`, counter)
	})
	log.Printf("listening to port *%s. press ctrl + c to cancel.\n", port)
	log.Fatal(http.ListenAndServe(port, mux))
}

func fetchFileSHA(url string) (File, error) {
	var file File
	resp, err := http.Get(url)
	if err != nil {
		return file, err
	}
	defer resp.Body.Close()
	if err := json.NewDecoder(resp.Body).Decode(&file); err != nil {
		return file, err
	}

	return file, nil
}

func validateUpdate(url string) (bool, error) {
	var isNew bool
	var events Events
	resp, err := http.Get(url)
	if err != nil {
		return isNew, err
	}
	defer resp.Body.Close()

	if err := json.NewDecoder(resp.Body).Decode(&events); err != nil {
		return isNew, err
	}
	for _, event := range events.Data {
		if event.CreatedAt.After(deltaTimestamp) {
			deltaTimestamp = event.CreatedAt
			isNew = true
		}
	}
	return isNew, nil
}

func fetchEventsAsBase64(url string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	buff, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(buff), nil
}

func commitFile(url, token string, file File) error {
	buff, err := json.Marshal(file)
	if err != nil {
		return err
	}
	client := &http.Client{}
	req, err := http.NewRequest("PUT", url, bytes.NewBuffer(buff))
	req.Header.Set("Content-Type", "application-json")
	req.Header.Set("Authorization", fmt.Sprintf("token %s", token))
	if err != nil {
		return err
	}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}
