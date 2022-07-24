# FROM alpine
FROM bash

# RUN apk add --update nodejs npm ffmpeg

# Install global tooling
# RUN npm install --global zx

WORKDIR /app
COPY . /app/

RUN chmod +x /app/scripts/preprocess.sh
