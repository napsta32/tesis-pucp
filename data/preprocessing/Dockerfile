# Dependencies
FROM fpena_bin_hashdeep as hashdeep

# Prepare main code runner
FROM node:16.20.0-alpine3.17

RUN apk add --update ffmpeg python3 tree

# Use /root/bin for binaries
RUN mkdir -p /root/bin
ENV PATH="$PATH:/root/bin"

# Install md5deep
COPY --from=hashdeep /root/hashdeep/src/md5deep /root/bin/
RUN chmod +x /root/bin/md5deep

WORKDIR /app

# Install dependencies
COPY package.json /app/
RUN npm install

# Copy source code
COPY . /app/
RUN npm run pre-build
