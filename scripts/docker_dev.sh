#!/bin/bash
docker buildx build --push --platform linux/arm64/v8,linux/amd64 -t jacoblincool/bahamut-automation:dev .

# docker build -t jacoblincool/bahamut-automation .
