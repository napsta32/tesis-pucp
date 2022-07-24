#!/usr/bin/env bash

mkdir -p /data/h36m/raw

echo "raw folder"
ls /data/h36m | grep .tgz | while read line; do echo "$line hereee";done
ls /data/h36m | grep .tgz | while read line
do
    mv /data/h36m/${line} /data/h36m/raw/${line}
done
# mv /data/h36m/** /data/h36m/raw
