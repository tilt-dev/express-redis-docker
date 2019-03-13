# Express Redis Docker app

Requirements: [Docker Community Edition](https://www.docker.com/community-edition), [Tilt](https://tilt.dev/)

To start the app run: `tilt up`. Courtesy of this original [sample app](https://github.com/HugoDF/express-redis-docker).

It will then be started on port 3000. 

# Endpoints

## Hello World

```sh
curl http://localhost:3000
```

## Storing Data
```sh
curl http://localhost:3000/store/my-key\?some\=value\&some-other\=other-value
```

## Fetching Data

```sh
curl http://localhost:3000/my-key
```
