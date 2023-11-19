# Default target is to build
.PHONY: build

# Build the container, using Dockerfile.combo + docker-compose.yml
build:
	docker-compose build

# Run the container
run:
	docker-compose up

