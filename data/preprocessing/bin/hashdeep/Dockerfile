# Prepare hashdeep dependency
FROM alpine:3.17

WORKDIR /root

RUN apk add --update git autoconf automake build-base bind-tools

# Use dns to find github.com
RUN git -c http.curloptResolve="+github.com:443:$(nslookup github.com 1.1.1.1 | grep Address | tail -n +2 | head -n 1 | awk '{ print $2 }')" \
    clone https://github.com/jessek/hashdeep.git hashdeep

# Install hashdeep by compiling source code
RUN cd hashdeep && sh bootstrap.sh && ./configure && make
