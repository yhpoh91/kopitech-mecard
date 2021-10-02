APP_NAME=yhpoh91/kopitech-mecard

VERSION_MAJOR=1
VERSION_MINOR=$(date -u +"%Y%m%d")
VERSION_PATCH=$(date -u +"%H%M%S")
VERSION="$VERSION_MAJOR.$VERSION_MINOR.$VERSION_PATCH"
echo "Version: $VERSION"

docker build -t $APP_NAME .
docker tag $APP_NAME $APP_NAME:$VERSION

docker push $APP_NAME:$VERSION
docker push $APP_NAME