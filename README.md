# Example Express/Redis on Docker Compose app

Requirements: [Tilt](https://tilt.dev/)

To start the app run:

```
tilt up
```


Tilt will assemble an image, deploy the app, and live update using Docker Compose.

View the app at http://localhost:3000/

When you make a change to [server.js](server.js), Tilt will sync the file to the container and restart the app.

For more details on how this works, see [the Tilt Docker Compose documentation](https://docs.tilt.dev/docker_compose.html).

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

Courtesy of this original [sample app](https://github.com/HugoDF/express-redis-docker).