#/bin/bash
# Script to do google drive operations
# Arguments:
# ${1}: Action. It can be UpdateFile or UploadFile
# ${2...}: Action arguments. See the python scripts for details

action=${1}
arguments=${@:2}

echo "$action $arguments"

docker build -t fpenac-upload-to-drive .
docker run -v ${PWD}:/app fpenac-upload-to-drive sh -c "python ${action}.py ${arguments}"
docker rmi fpenac-upload-to-drive
