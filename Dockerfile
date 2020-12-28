FROM alpine AS service

RUN apk add build-base

FROM node:14.11.0-alpine AS build

RUN apk add python python3 make g++ gcc

WORKDIR /build

ENV PKG_CACHE_PATH=/build/ppkg

ADD package.json .
ADD package-lock.json .

RUN npm i

ADD tsconfig.json .
ADD src src
ADD config_map config_map
RUN npm run build
RUN npm run pkg

FROM service

VOLUME ["/build/public", "/build/out", "/build/ppkg"]

WORKDIR /build

COPY --from=build /build/config_map /build/config_map
COPY --from=build /build/pkg/app /build/pkg/app

EXPOSE 5001

CMD ["/build/pkg/app"]
