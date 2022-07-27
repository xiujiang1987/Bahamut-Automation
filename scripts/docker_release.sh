#!/bin/sh
docker buildx bake --load --set "*.platform=linux/arm/v7,linux/arm64/v8,linux/amd64"
version=$(git describe --tags --abbrev=0)
docker tag "jacoblincool/bahamut-automation:pure" "jacoblincool/bahamut-automation:pure-$version"
docker tag "jacoblincool/bahamut-automation:firefox" "jacoblincool/bahamut-automation:firefox-$version"
docker tag "jacoblincool/bahamut-automation:chromium" "jacoblincool/bahamut-automation:chromium-$version"
docker tag "jacoblincool/bahamut-automation:webkit" "jacoblincool/bahamut-automation:webkit-$version"
docker tag "jacoblincool/bahamut-automation:all" "jacoblincool/bahamut-automation:all-$version"
docker push --all-tags jacoblincool/bahamut-automation
