# -*- mode: Python -*-

def write_file(path, contents):
  local("echo \"{}\" > {}".format(contents, path))

config = {
  "redis": {
    "image": "redis",
    "container_name": "cache",
    "expose": [6379],
  },
  "app": {
    "image": "tilt.dev/express-redis-app",
    "links": ["redis"],
    "ports": ["3000:3000"],
    "environment": [
      "REDIS_URL=redis://cache",
      "NODE_ENV=development",
      "PORT=3000",
    ],
    "command": "sh -c 'node server.js'"
  },
}

yaml = encode_yaml(config)
write_file('docker-compose-generated.yml', yaml)

docker_compose('docker-compose-generated.yml')

docker_build(
  # Image name - must match the image in the docker-compose file
  'tilt.dev/express-redis-app',
  # Docker context
  '.',
  live_update = [
    # Sync local files into the container.
    sync('.', '/var/www/app'),

    # Re-run npm install whenever package.json changes.
    run('npm i', trigger='package.json'),

    # Restart the process to pick up the changed files.
    restart_container()
  ],
  ignore=['docker-compose-generated.yml'],
)
