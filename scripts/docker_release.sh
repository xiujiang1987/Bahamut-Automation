#!/bin/sh
set -e

version=$(git describe --tags --abbrev=0)
compose="docker-compose.yml"

main() {
    if [ $# -eq 0 ]; then
        build chromium-light chromium firefox webkit chrome msedge all
    else
        build $@
    fi
}

build() {
    normal_images=()
    light_images=()
    for tag in $@; do
        if [[ $tag == *"-light" ]]; then
            light_images+=($tag)
        else
            normal_images+=($tag)
        fi
    done

    printf "Building Lightweight Image: %s\n" "${light_images[*]}"
    printf "Building Normal Image: %s\n" "${normal_images[*]}"

    if [ ${#light_images[@]} != 0 ]; then
        docker buildx bake --push --set "*.platform=linux/arm64/v8,linux/amd64" --file $compose ${light_images[@]}
        for tag in ${light_images[@]}; do
            regctl image copy "jacoblincool/bahamut-automation:$tag" "jacoblincool/bahamut-automation:$tag-$version"
        done
    fi
    if [ ${#normal_images[@]} != 0 ]; then
        docker buildx bake --push --set "*.platform=linux/arm/v7,linux/arm64/v8,linux/amd64" --file $compose ${normal_images[@]}
        for tag in ${normal_images[@]}; do
            regctl image copy "jacoblincool/bahamut-automation:$tag" "jacoblincool/bahamut-automation:$tag-$version"
            if [[ $tag == "all" ]]; then
                regctl image copy "jacoblincool/bahamut-automation:$tag" "jacoblincool/bahamut-automation:latest"
            fi
        done
    fi
}

main $@
