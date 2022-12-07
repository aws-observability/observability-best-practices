FROM golang:1.15-alpine AS build
RUN go env -w GOPROXY=direct
RUN apk add --no-cache git
RUN apk update && apk add ca-certificates
WORKDIR /usr/src/app
COPY . .
RUN CGO_ENABLED=0 go build -a -ldflags '-extldflags "-static"'

FROM amazonlinux:2
COPY --from=build /usr/src/app/ho11y /ho11y
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
RUN chown -R 1001:1 /ho11y
USER 1001
EXPOSE 8765
CMD ["/ho11y"]
