# Prepare hashdeep dependency
FROM alpine:3.17

WORKDIR /root

RUN apk add --update git autoconf automake build-base
# Use dns to support rootless docker
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf && \
    git clone https://github.com/jessek/hashdeep.git hashdeep
RUN cd hashdeep && sh bootstrap.sh && ./configure && make
