#!/usr/bin/env bash

rm -rf /data/h36m/raw
mkdir -p /data/h36m/raw

echo "raw folder"
ls /data/h36m | grep .tgz | while read $line;do echo "$line hereee";done
# mv /data/h36m/** /data/h36m/raw
