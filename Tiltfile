# -*- mode: Python -*-

# Enforce a minimum Tilt version, so labels are supported
# https://docs.tilt.dev/api.html#api.version_settings
version_settings(constraint='>=0.22.1')

docker_compose('docker-compose.yml', profiles=['*'])

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

# Add labels to Docker services
dc_resource('redis', labels=["database"])
dc_resource('app', labels=["server"])
