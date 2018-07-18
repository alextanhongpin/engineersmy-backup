VERSION=1.0.3
ORGANIZATION=alextanhongpin
IMAGE=event-webui
REPO=${ORGANIZATION}/${IMAGE}

build-prod:
	yarn run build
	cp -r dist server
	docker build --no-cache -t ${REPO}:latest .
	docker tag ${REPO}:latest ${REPO}:${VERSION} 
	docker push ${REPO}:latest
	docker push ${REPO}:${VERSION}

build-dev:
	yarn run build
	cp -r dist server
	docker build -t ${REPO}:latest .

serve-static:
	docker run -p 8080:8080  ${REPO}:latest

push:
	docker push ${REPO}:${VERSION}