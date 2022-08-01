#! /bin/bash

if ! [[ $(docker network ls --filter name="fpena_filemanager_public_network" -q) ]]
then
    echo "Creating docker network..."
    docker network create fpena_filemanager_public_network
fi

echo "database initialization ready"
