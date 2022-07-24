#!/usr/bin/env bash

mkdir -p /data/h36m/raw
mkdir -p /data/h36m/uncompressed

echo "raw folder"
ls /data/h36m/raw | grep .tgz | while read line
do
    echo '{'
    echo '  "file": "'"/data/h36m/raw/${line}"'",'
    echo '  "sha": "'$(md5sum /data/h36m/raw/${line})'"'
    echo '},'
done
# mv /data/h36m/** /data/h36m/raw
