#!/bin/sh
set -e
commit=$(git rev-parse --short main)
docker buildx bake --push --set "*.platform=linux/arm64/v8,linux/amd64" --file "docker-compose.dev.yml" chromium-light
regctl image copy "jacoblincool/bahamut-automation:chromium-light-dev" "jacoblincool/bahamut-automation:chromium-light-$commit"
docker buildx bake --push --set "*.platform=linux/arm/v7,linux/arm64/v8,linux/amd64" --file "docker-compose.dev.yml" chromium firefox webkit chrome msedge all
regctl image copy "jacoblincool/bahamut-automation:chromium-dev" "jacoblincool/bahamut-automation:chromium-$commit"
regctl image copy "jacoblincool/bahamut-automation:firefox-dev" "jacoblincool/bahamut-automation:firefox-$commit"
regctl image copy "jacoblincool/bahamut-automation:webkit-dev" "jacoblincool/bahamut-automation:webkit-$commit"
regctl image copy "jacoblincool/bahamut-automation:chrome-dev" "jacoblincool/bahamut-automation:chrome-$commit"
regctl image copy "jacoblincool/bahamut-automation:msedge-dev" "jacoblincool/bahamut-automation:msedge-$commit"
regctl image copy "jacoblincool/bahamut-automation:all-dev" "jacoblincool/bahamut-automation:all-$commit"
