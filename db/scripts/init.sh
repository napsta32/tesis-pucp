#! /bin/bash

if [[ $(docker network ls --filter name="fpena_preprocessing_db_data" -q) ]]
    docker network create fpena_preprocessing_db_data
fi
