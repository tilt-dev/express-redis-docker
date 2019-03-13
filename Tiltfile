# -*- mode: Python -*-

docker_compose('docker-compose.yml')

img = fast_build(
  # Image name - must match the image in the docker-compose file
  'tilt.dev/express-redis-app',
  # Dockerfile to use as a 'base'. Must not mount any files.
  'Dockerfile',
  # Command to run to start the process.
  'node server.js')

# Mount local files into the container.
img.add('.', '/var/www/app')

# Re-run npm install whenever package.json changes.
img.run('npm i', trigger='package.json')
