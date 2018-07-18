package main

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"log"
	"os"
	"runtime"
	"runtime/pprof"
	"sync"
	"time"

	"./model"
	"./perf"
)

func main() {

	var accessToken = flag.String("FB_TOKEN", "", "Facebook Graph API Access Token")
	var cpuprofile = flag.String("cpuprofile", "", "write cpu profile to file")
	var memprofile = flag.String("memprofile", "", "write memory profile to this file")

	flag.Parse()

	if *cpuprofile != "" {
		f, err := os.Create(*cpuprofile)
		if err != nil {
			log.Fatal(err)
		}
		pprof.StartCPUProfile(f)
		defer pprof.StopCPUProfile()
	}

	if *memprofile != "" {
		f, err := os.Create(*memprofile)
		if err != nil {
			log.Fatal(err)
		}
		pprof.WriteHeapProfile(f)
		f.Close()
		return
	}

	graphAPI := model.GraphAPI{AccessToken: *accessToken}
	keywords := []string{"react", "devkini", "tensorflow", "python", "golang", "google", "microsoft", "microservice", "iot", "rust", "scala", "ios", "android", "java", "kotlin", "javascript", "php", "laravel", "r", "aws", "azure", "agile", "devops", "programming"}

	searchPipeline := func(
		done <-chan interface{},
		worker chan interface{},
		values ...string,
	) <-chan model.SearchPipelineResult {
		stream := make(chan model.SearchPipelineResult)

		var wg sync.WaitGroup
		wg.Add(len(values))

		go func() {
			for k, v := range values {
				log.Println("start worker:", k)
				worker <- k
				// Create multiple workers here
				go func(v string) {
					defer wg.Done()
					defer func() {
						out := <-worker
						log.Println("stop worker:", out)
					}()

					q := perf.Concat(v, " ", "malaysia")
					var result model.SearchPipelineResult
					var response model.SearchResponse

					// This is harcoded here, probably pass through context is a better idea
					res, err := graphAPI.Search(q)
					if err != nil {
						result.Error = err
					} else {
						if err := json.Unmarshal(res, &response); err != nil {
							result.Error = err
						} else {
							result.Result = response
						}
					}

					select {
					case <-done:
						return
					case stream <- result:
					}
				}(v)

			}
		}()

		go func() {
			wg.Wait()
			close(stream)
			log.Println("end search pipeline")
		}()
		return stream
	}

	eventPipeline := func(
		done <-chan interface{},
		worker chan interface{},
		value <-chan model.SearchPipelineResult,
	) <-chan model.EventPipelineResult {
		stream := make(chan model.EventPipelineResult)
		var wg sync.WaitGroup

		go func() {
			for in := range value {
				wg.Add(len(in.Result.Data))

				if in.Error != nil {
					var result model.EventPipelineResult
					result.Error = in.Error
					select {
					case <-done:
						return
					case stream <- result:
					}
					return
				}

				for k, event := range in.Result.Data {
					worker <- k

					go func(v model.Search) {
						defer wg.Done()
						defer func() {
							<-worker
						}()
						var result model.EventPipelineResult
						var response model.EventResponse

						// time.Date(2017, 1, 1, 0, 0, 0, 0, time.UTC).Format("2006-01-02")
						res, err := graphAPI.Event(v.ID, time.Now().Format("2006-01-02"))
						if err != nil {
							result.Error = err
						} else {
							if err := json.Unmarshal(res, &response); err != nil {
								result.Error = err
							} else {
								result.Result = response
							}
						}
						select {
						case <-done:
							return
						case stream <- result:
						}
					}(event)
				}

			}

			go func() {
				wg.Wait()
				close(stream)
				log.Println("end event pipeline")
			}()

		}()

		return stream
	}

	numCPUs := runtime.NumCPU()
	numGoroutines := runtime.NumGoroutine()
	log.Println("start goroutines:", numGoroutines)

	done := make(chan interface{})
	searchWorker := make(chan interface{}, numCPUs)
	eventWorker := make(chan interface{}, 100)

	defer close(searchWorker)
	defer close(eventWorker)
	defer close(done)

	pipeline1 := searchPipeline(done, searchWorker, keywords...)
	pipeline2 := eventPipeline(done, eventWorker, pipeline1)

	var events []model.Event
	for v := range pipeline2 {
		if v.Error != nil {
			log.Println(v.Error.Error())
			continue
		}
		if len(v.Result.Data) > 0 {
			for _, item := range v.Result.Data {
				events = append(events, item)
			}
		}
	}
	resp, err := json.Marshal(events)
	if err != nil {
		log.Printf("error marshalling data: %s\n", err.Error())
	}
	if err := ioutil.WriteFile("output.json", resp, 0644); err != nil {
		log.Printf("error writing to file: %s\n", err.Error())
	}

	// time.Sleep(10 * time.Second)
	numGoroutines = runtime.NumGoroutine()
	log.Println("end goroutines:", numGoroutines)
	log.Println("process exiting")
}
