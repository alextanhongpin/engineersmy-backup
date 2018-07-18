FROM alpine:latest  

MAINTAINER Alex Hong Pin Tan <alextan220990@gmail.com>

LABEL version="1.0.0"
LABEL description="Backup events data from api endpoint"
LABEL language="golang:1.9"
LABEL keywords="go, event-service, backup"

RUN apk --no-cache add ca-certificates

WORKDIR /root/
COPY app .
CMD ["./app"]