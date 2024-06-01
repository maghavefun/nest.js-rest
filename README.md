## Clone the project

```bash
git clone https://github.com/maghavefun/fsh-rest-test.git

```

## Local installation of project(not recommended)

```bash
$ npm ci
```

Before starting the project locally or in docker, make shure that there is a .env file with environment variables. Example in .example.env

## Starting the project in local environment(not recommended)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Starting project with docker

Start project with rebuilding container in case if you added a new dependencies. In other cases start without --build flag.

```bash
docker compose up --build
```

Stop the project in docker containers with removing specified volumes in docker-compose.yml

```bash
docker compose down -v
```

Restart the containers

```bash
docker compose restart
```
