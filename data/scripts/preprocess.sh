#!/usr/bin/env bash

rm -rf /data/h36m/raw
mkdir -p /data/h36m/raw

ls /data/h36m
echo "raw folder"
ls /data/h36m | grep tar.gz | while read $line;do echo "$line hereee";done
# mv /data/h36m/** /data/h36m/raw
