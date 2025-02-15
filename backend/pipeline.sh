#!/bin/bash 

IMAGE="backend"

if [ "$(docker ps -q -f name=$IMAGE)" ]; then

    docker stop $IMAGE
    docker rm $IMAGE
fi

if [ "$(docker images -q $IMAGE)" ]; then

    docker rmi $IMAGE
fi

docker build -t $IMAGE .

docker run -d -p 8000:8000 --name $IMAGE $IMAGE