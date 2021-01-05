FROM alpine AS service

RUN apk add build-base

FROM node:14.11.0-alpine AS build

RUN apk add python python3 make g++ gcc

WORKDIR /build

ENV PKG_CACHE_PATH=/build/ppkg

ADD package.json .
ADD package-lock.json .

# install dependesies
RUN npm i

ADD tsconfig.json .
ADD src src
ADD config_map config_map

# build the project
RUN npm run build

# create exutable binary of project
RUN npm run pkg

FROM service

# volumes for cecheing files
VOLUME ["/build/public", "/build/out", "/build/ppkg"]

WORKDIR /build

COPY --from=build /build/config_map /build/config_map
COPY --from=build /build/pkg/app /build/pkg/app

EXPOSE 5001

CMD ["/build/pkg/app"]
