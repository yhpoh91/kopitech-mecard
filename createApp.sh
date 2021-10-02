APP_NAME="kopitech-mecard"
APP_PORT=8080
APP_IMAGE=yhpoh91/kopitech-mecard
DOCKER_VOLUME_PATH=/srv/docker/volume

POSTGRES_USERNAME=kopitest
POSTGRES_PASSWORD=kopitest
POSTGRES_URL=postgres://$POSTGRES_USERNAME:$POSTGRES_PASSWORD@pg-$APP_NAME:5432/$POSTGRES_USERNAME

# Create Network
echo "Creating Network"
docker network create -d bridge network-$APP_NAME

# Create App
echo "Creating App [$APP_NAME] to listen on public $APP_PORT"
docker stop app-$APP_NAME
docker pull $APP_IMAGE
docker run \
--rm \
--name app-$APP_NAME \
--env-file .env \
-e DATABASE_URL=$POSTGRES_URL \
-d \
-p $APP_PORT:8080 \
$APP_IMAGE


# Connect Network
echo "Connecting containers to network"
docker network connect network-$APP_NAME pg-$APP_NAME

echo "Completed"