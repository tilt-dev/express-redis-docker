# -*- mode: Python -*-

use_docker_compose = str(local('echo $USE_DOCKER_COMPOSE')).strip()
use_k8s = not use_docker_compose
if use_docker_compose:
  docker_compose('docker-compose.yml')

if use_k8s:
  k8s_yaml(['app-deployment.yaml', 'app-service.yaml', 'redis-deployment.yaml', 'redis-service.yaml'])
  k8s_resource('redis', port_forwards='8005:6379')
  k8s_resource('app', port_forwards='8006:3000')

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
