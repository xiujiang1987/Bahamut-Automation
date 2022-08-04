#!/bin/sh
set -e
version=$(git describe --tags --abbrev=0)
docker buildx bake --push --set "*.platform=linux/arm64/v8,linux/amd64" chromium-light
regctl image copy "jacoblincool/bahamut-automation:chromium-light" "jacoblincool/bahamut-automation:chromium-light-$version"
docker buildx bake --push --set "*.platform=linux/arm/v7,linux/arm64/v8,linux/amd64" chromium firefox webkit chrome msedge all
regctl image copy "jacoblincool/bahamut-automation:chromium" "jacoblincool/bahamut-automation:chromium-$version"
regctl image copy "jacoblincool/bahamut-automation:firefox" "jacoblincool/bahamut-automation:firefox-$version"
regctl image copy "jacoblincool/bahamut-automation:webkit" "jacoblincool/bahamut-automation:webkit-$version"
regctl image copy "jacoblincool/bahamut-automation:chrome" "jacoblincool/bahamut-automation:chrome-$version"
regctl image copy "jacoblincool/bahamut-automation:msedge" "jacoblincool/bahamut-automation:msedge-$version"
regctl image copy "jacoblincool/bahamut-automation:all" "jacoblincool/bahamut-automation:all-$version"
