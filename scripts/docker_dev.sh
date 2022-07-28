#!/bin/sh
set -e
commit=$(git rev-parse --short main)
docker buildx bake --push --set "*.platform=linux/arm/v7,linux/arm64/v8,linux/amd64" --file docker-compose.dev.yml
docker pull jacoblincool/bahamut-automation:dev-firefox
docker pull jacoblincool/bahamut-automation:dev-chromium
docker pull jacoblincool/bahamut-automation:dev-webkit
docker pull jacoblincool/bahamut-automation:dev-all
docker tag "jacoblincool/bahamut-automation:dev-firefox" "jacoblincool/bahamut-automation:firefox-$commit"
docker tag "jacoblincool/bahamut-automation:dev-chromium" "jacoblincool/bahamut-automation:chromium-$commit"
docker tag "jacoblincool/bahamut-automation:dev-webkit" "jacoblincool/bahamut-automation:webkit-$commit"
docker tag "jacoblincool/bahamut-automation:dev-all" "jacoblincool/bahamut-automation:all-$commit"
docker push --all-tags jacoblincool/bahamut-automation
