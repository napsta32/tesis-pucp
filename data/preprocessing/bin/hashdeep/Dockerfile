# Prepare hashdeep dependency
FROM alpine:3.17

WORKDIR /root

RUN apk add --update git autoconf automake build-base

# Use dns to support rootless docker
COPY ./.dns /root/.dns
ENV RES_OPTIONS="conf-file /root/.dns"
ENV RESOLV_CONF="/root/.dns"
RUN rc-service dnsd restart

# Install hashdeep by compiling source code
RUN git clone https://github.com/jessek/hashdeep.git hashdeep
RUN cd hashdeep && sh bootstrap.sh && ./configure && make
