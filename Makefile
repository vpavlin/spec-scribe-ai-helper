IMAGE := quay.io/vpavlin0/decentralize-workshop

all: push

build:
	npm run build
container: build
	docker build -t $(IMAGE) .
push: container
	docker push $(IMAGE)