FROM golang:1.17 AS base

FROM base AS dev

RUN curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin

WORKDIR /usr/app
CMD ["air"]
