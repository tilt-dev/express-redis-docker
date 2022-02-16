# -*- mode: Python -*-

# Enforce a minimum Tilt version, so labels are supported
# https://docs.tilt.dev/api.html#api.version_settings
version_settings(constraint='>=0.22.1')

config.define_string('mode', usage='Whether to run with docker-compose only (--mode dc) or combined docker-compose+k8s (--mode both). Defaults to dc.')
config.define_string('network', usage='With --mode=both, whether to use docker network (--network docker) or host network (--network host). Defaults to host.')

cfg = config.parse()
mode = cfg.get('mode', 'dc')
redis_host = 'host.docker.internal' # using host networking and ports mapped to host

if cfg.get('network', 'host') == 'docker':
    if k8s_context().startswith('kind-'):
        redis_host = 'cache'        # with docker network
    else:
        print("Docker networking only works with Kind clusters")

dc_arg = 'docker-compose.yml'
if mode == 'both':
    compose = read_yaml(dc_arg)
    compose['services'].pop('app')
    dc_arg = encode_yaml(compose)

docker_compose(dc_arg)

if mode == 'both':
    docker_build_with_restart = load_dynamic('ext://restart_process')['docker_build_with_restart']
    docker_build_with_restart(
        # Image name - must match the image in the deployment below
        'tilt.dev/express-redis-app',
        # Docker context
        '.',
        entrypoint=str(local("sed -n '/^ENTRYPOINT/{s/ENTRYPOINT *//;p;q;}' Dockerfile")).strip(),
        live_update = [
            # Sync local files into the container.
            sync('.', '/var/www/app'),

            # Re-run npm install whenever package.json changes.
            run('npm i', trigger='package.json'),
        ],
    )
else:
    docker_build(
        # Image name - must match the image in the docker-compose file
        'tilt.dev/express-redis-app',
        # Docker context
        '.',
        live_update=[
            # Sync local files into the container.
            sync('.', '/var/www/app'),

            # Re-run npm install whenever package.json changes.
            run('npm i', trigger='package.json'),

            # Restart the process to pick up the changed files.
            restart_container()
        ]
    )


if mode == 'both':
    deployment_create = load_dynamic('ext://deployment')['deployment_create']
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
    k8s_resource('app', port_forwards=["3000"], labels=["server"], resource_deps=["redis", "network"])

    fmt = {'action': 'connect'}
    if redis_host == 'host.docker.internal':
        network_cmd = "echo No network {action} needed, using host.docker.internal"
    else:
        control_plane_name = k8s_context().replace('kind-', '')
        fmt['control_plane_name'] = control_plane_name
        network_cmd = "docker network {action} tilt-example-docker-compose_database {control_plane_name}-control-plane || true"

    if config.tilt_subcommand == 'down':
        fmt['action'] = 'disconnect'
        local(network_cmd.format(**fmt))
    local_resource('network', network_cmd.format(**fmt), resource_deps=["redis"], labels=["server"])

else:
    dc_resource('app', labels=["server"])

dc_resource('redis', labels=["database"])
