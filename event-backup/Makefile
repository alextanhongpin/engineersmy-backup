ORGANIZATION=alextanhongpin
EVENT_IMAGE=event-backup
EVENT_VERSION=1.0.0

EVENT_REPO=${ORGANIZATION}/${EVENT_IMAGE}


up:
	@echo "Starting docker-compose"
	@docker-compose up -d

down:
	@echo "Stopping docker-compose"
	@docker-compose down

event:
	@echo "Building event backup go binary"
	CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app && \
	docker build -t ${EVENT_REPO}:${EVENT_VERSION} . && \
	rm -rf app

	@echo Pushing a new version ${EVENT_REPO}:${EVENT_VERSION} to dockerhub...
	docker tag ${EVENT_REPO}:${EVENT_VERSION} ${EVENT_REPO}:latest && \
	docker push ${EVENT_REPO}:${EVENT_VERSION} && \
	docker push ${EVENT_REPO}:latest
	@echo ${EVENT_REPO}:${EVENT_VERSION} is now available at dockerhub