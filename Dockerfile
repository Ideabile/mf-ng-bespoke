#
# Mangiafire-engine-transformer
#
# VERSION                1.0.1
FROM mhart/alpine-node
MAINTAINER Mauro Mandracchia <info@ideabile.com>
LABEL Description="Generate bespoke presentation" Vendor="ideabile.com" Version="1.0.1"
VOLUME ["/dest", "/content"]

ENV WWW=/dest
ENV MAIN=./

WORKDIR /
ADD ${MAIN}package.json /package.json
RUN npm install
ADD $MAIN /

ENTRYPOINT ["./index.js", "--src=/content", "--dest=/dest"]
