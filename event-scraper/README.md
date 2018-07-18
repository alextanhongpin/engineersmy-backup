# Event Scraper

Automating event creation by scraping data from different sources.


## Facebook 

Using `Graph API Version: v2.10`.

### Search for a group
```
$ curl https://graph.facebook.com/v2.10/search?q=python&type=group&access_token=<YOUR_TOKEN_HERE>
```

### Get events by group id with date parameter
```
$ curl https://graph.facebook.com/v2.10/1383091761939295/events?since=2017-01-1&access_token=<YOUR_TOKEN_HERE>
```

## Profiling

### Race condition

```
$ go run -race main.go -FB_TOKEN=<YOUR_FB_TOKEN>
```

### Profile

```bash
$ go run main.go -FB_TOKEN=<YOUR_FB_TOKEN> -cpuprofile=main.prof -memprofile=main.mprof
# CPU profiling
$ go tool pprof maincpu main.prof

# Memory profiling
$ go tool pprof mainmem main.mprof

# Others
$ (pprof) top 100
$ (pprof) top5 -cum
$ (pprof) web
```


## TODO:
1. Add more sources (Peatix, Eventbrite, Meetups)


