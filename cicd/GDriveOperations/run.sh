#/bin/bash

docker build -t fpenac-upload-to-drive .
docker run -v ${PWD}:/app fpenac-upload-to-drive python UploadToDrive.py ${1} ${2}
docker rmi fpenac-upload-to-drive
