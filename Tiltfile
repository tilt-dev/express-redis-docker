# -*- mode: Python -*-

docker_compose('docker-compose.yml')

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
  ])
