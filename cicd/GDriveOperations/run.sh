#/bin/bash
# Script to do google drive operations
# Arguments:
# ${1}: Action. It can be UpdateFile or UploadFile
# ${2...}: Action arguments. See the python scripts for details

docker build -t fpenac-upload-to-drive .
docker run -v ${PWD}:/app fpenac-upload-to-drive python ${1}.py "${@:2}"
docker rmi fpenac-upload-to-drive
