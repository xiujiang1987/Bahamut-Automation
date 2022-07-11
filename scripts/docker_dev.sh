#!/bin/sh
commit=$(git rev-parse --short main)
docker buildx build --push --platform linux/arm64/v8,linux/amd64 -t "jacoblincool/bahamut-automation:$commit" -t jacoblincool/bahamut-automation:dev .

# docker build -t jacoblincool/bahamut-automation .
