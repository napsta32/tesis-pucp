FROM node:16.20.0-alpine3.17

RUN apk add --update ffmpeg python3

WORKDIR /app

# Install dependencies
COPY package.json /app/
RUN npm install

# Copy source code
COPY . /app/

# Add execution permissions to index file
RUN chmod -R +x /app/src/index.mjs
