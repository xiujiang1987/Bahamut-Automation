#!/bin/bash
version=$(git describe --tags --abbrev=0)
docker buildx build --push --platform linux/arm64/v8,linux/amd64 -t "jacoblincool/bahamut-automation:$version" -t jacoblincool/bahamut-automation:latest .

# docker build -t jacoblincool/bahamut-automation .
