#!/bin/bash

HOSTNAME="k3d-local-registry"
IP="127.0.0.1"
HOSTS_FILE="/etc/hosts"
CLIENT_IMAGE="client:latest"
BACKEND_IMAGE="backend:latest"
REGISTRY="k3d-local-registry:5001"
CLUSTER_NAME="cc25-cluster"


start_cluster() {
    if ! command -v k3d &> /dev/null
    then
        echo "k3d could not be found, installing k3d..."
        curl -s https://raw.githubusercontent.com/rancher/k3d/main/install.sh | bash
    else
        echo "k3d is already installed."
    fi

    if k3d cluster list | grep -q $CLUSTER_NAME
    then
        echo "k3d cluster $CLUSTER_NAME is already running."
        k3d cluster delete $CLUSTER_NAME
    fi

    # Check to see if the registry exists
    if k3d registry list | grep -q 'k3d-local-registry'
    then
        k3d registry delete k3d-local-registry
    fi

    k3d registry create local-registry --port 5001

    if grep -q "$HOSTNAME" "$HOSTS_FILE"; then
        echo "The hostname '$HOSTNAME' already exists in $HOSTS_FILE."
    else
        echo "Adding '$HOSTNAME' to $HOSTS_FILE..."
        echo "$IP $HOSTNAME" | sudo tee -a "$HOSTS_FILE" > /dev/null

        if grep -q "$HOSTNAME" "$HOSTS_FILE"; then
            echo "Successfully added '$HOSTNAME' to $HOSTS_FILE."
        else
            echo "Failed to add '$HOSTNAME' to $HOSTS_FILE. Please check permissions."
        fi
    fi

    k3d cluster create $CLUSTER_NAME \
        --api-port 6550 \
        -p "8081:8081@loadbalancer" \
        -p "8082:8082@loadbalancer" \
        --agents 2 \
        --registry-use $REGISTRY

    # Check if the cluster is running
    if k3d cluster list | grep -q $CLUSTER_NAME
    then
        echo "k3d cluster $CLUSTER_NAME is up and running."
    else
        echo "Failed to create k3d cluster."
        exit 1
    fi

    # Build frontend
    # if [[ "$(docker images -q $CLIENT_IMAGE 2> /dev/null)" == "" ]]; then
    #     cd ../client
    #     docker build -t $CLIENT_IMAGE .
    #     cd ../cluster
    # fi

    # Build backend
    # if [[ "$(docker images -q $BACKEND_IMAGE 2> /dev/null)" == "" ]]; then
    #     cd ../backend
    #     docker build -t $BACKEND_IMAGE .
    #     cd ../dummy
    # fi

    # Tag and push the Docker images to the local registry
    # docker tag $CLIENT_IMAGE $REGISTRY/$CLIENT_IMAGE
    # docker tag $BACKEND_IMAGE $REGISTRY/$BACKEND_IMAGE

    # docker push $REGISTRY/$CLIENT_IMAGE
    # docker push $REGISTRY/$BACKEND_IMAGE

    kubectl apply -f ingress.yaml
    # kubectl apply -f client_deployment.yaml
    # kubectl apply -f client_service.yaml
    # kubectl apply -f backend_deployment.yaml
    # kubectl apply -f backend_service.yaml
}

# Function to stop the k3d cluster
stop_cluster() {
    k3d cluster delete $CLUSTER_NAME
}

# Check if the user passed "stop" as a parameter
if [ "$1" == "stop" ]; then
    stop_cluster
    exit 0
fi

# Start the k3d cluster
start_cluster