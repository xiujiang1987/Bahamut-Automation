#!/bin/sh
docker buildx bake --load --set "*.platform=linux/arm/v7,linux/arm64/v8,linux/amd64"
commit=$(git rev-parse --short main)
docker tag "jacoblincool/bahamut-automation:pure" "jacoblincool/bahamut-automation:pure-$commit"
docker tag "jacoblincool/bahamut-automation:firefox" "jacoblincool/bahamut-automation:firefox-$commit"
docker tag "jacoblincool/bahamut-automation:chromium" "jacoblincool/bahamut-automation:chromium-$commit"
docker tag "jacoblincool/bahamut-automation:webkit" "jacoblincool/bahamut-automation:webkit-$commit"
docker tag "jacoblincool/bahamut-automation:all" "jacoblincool/bahamut-automation:all-$commit"
docker push --all-tags jacoblincool/bahamut-automation
