# -*- mode: Python -*-

# Enforce a minimum Tilt version, so labels are supported
# https://docs.tilt.dev/api.html#api.version_settings
version_settings(constraint='>=0.22.1')

docker_compose('docker-compose.yml')

# redis_host = 'cache'              # with docker network
redis_host = 'host.docker.internal' # using host networking and ports mapped to host

load('ext://restart_process', 'docker_build_with_restart')
docker_build_with_restart(
  # Image name - must match the image in the docker-compose file
  'tilt.dev/express-redis-app',
  # Docker context
  '.',
  entrypoint=str(local("sed -n '/^ENTRYPOINT/{s/ENTRYPOINT *//;p;q;}' Dockerfile")).strip(),
  live_update = [
    # Sync local files into the container.
    sync('.', '/var/www/app'),

    # Re-run npm install whenever package.json changes.
    run('npm i', trigger='package.json'),
  ])

load('ext://deployment', 'deployment_create')
deployment_create(
    'app',
    'tilt.dev/express-redis-app',
    ports=["3000"],
    env=[
        {'name':'PORT', 'value':'3000'},
        {'name':'REDIS_URL', 'value':'redis://'+redis_host},
        {'name':'NODE_ENV', 'value':'development'},
    ]
)

# Add labels to Docker services
dc_resource('redis', labels=["database"])

if redis_host == 'host.docker.internal':
    network_cmd = "echo No network {action} needed, using host.docker.internal"
else:
    network_cmd = "docker network {action} tilt-example-docker-compose_database kind-control-plane || true"
action = 'connect'
if config.tilt_subcommand == 'down':
    local(network_cmd.format(action='disconnect'))
local_resource('network', network_cmd.format(action=action), resource_deps=["redis"], labels=["server"])

k8s_resource('app', port_forwards=["3000"], labels=["server"], resource_deps=["redis", "network"])
