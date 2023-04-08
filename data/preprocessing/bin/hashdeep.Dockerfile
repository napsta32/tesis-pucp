# Prepare hashdeep dependency
FROM alpine:3.17

WORKDIR /root

RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf

RUN apk add --update git autoconf automake build-base
RUN git clone https://github.com/jessek/hashdeep.git hashdeep && \
    cd hashdeep && sh bootstrap.sh && ./configure && make
