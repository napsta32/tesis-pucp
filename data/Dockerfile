FROM alpine

RUN apk add --update python3 python3-pip ffmpeg

WORKDIR /app
COPY . /app/

RUN python3 -m pip install -r requirements.txt
RUN chmod +x /app/scripts/preprocess.sh
