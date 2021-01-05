# auth

* Installing steps
    1. `git pull origin https://github.com/litkod/voucher-api.git`
    2. `npm i`

* Running for development outside docker
    1. `npm run watch`
    2. `npm start` OR `npm run dev`

* Running for development inside docker you can use docker-compose-dev.yml
    1. install docker-compose executable binary
    2. install makefile on your system
    3. `make dev`

* Running on production you can use docker-compose-swarm.yml
    1. install docker-compose executable binary
    2. install makefile on your system
    3. make build
    4. make swarm
    5. after that you can deploy your docker image to eny docker cloud for example docker-hub or your custom self host docker image registry
    

Used main packages koa and koa-*, sequelize and them dependencies, for configuration I use json5 format

system environment variables will override these configs for example `ENV app: {logging: "gebug"}` -> `app_logging: "info"`on `conf.json5` file

programming language is typescript version `^4.1.3`

node.js version `^14.14.20`
