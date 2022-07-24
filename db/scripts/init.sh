#! /bin/bash

if ! [[ $(docker network ls --filter name="fpena_database_network" -q) ]]
then
    echo "Creating docker network..."
    docker network create fpena_database_network
fi

echo "database initialization ready"
