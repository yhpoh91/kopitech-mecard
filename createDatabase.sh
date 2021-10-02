APP_NAME="kopitech-mecard"
DOCKER_VOLUME_PATH=/srv/docker/volume

POSTGRES_USERNAME=kopitest
POSTGRES_PASSWORD=kopitest

# Create Network
echo "Creating Network"
docker network create -d bridge network-$APP_NAME

# Create Postgres
mkdir -p $DOCKER_VOLUME_PATH
echo "Creating PG Database"
docker run \
--rm \
--name pg-$APP_NAME \
-e POSTGRES_USER=$POSTGRES_USERNAME \
-e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
-d \
-v $DOCKER_VOLUME_PATH/postgres_$APP_NAME:/var/lib/postgresql/data \
postgres


# Connect Network
echo "Connecting containers to network"
docker network connect network-$APP_NAME pg-$APP_NAME

echo "Completed"