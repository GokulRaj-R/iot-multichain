#!/bin/bash

if [ $# -eq 1 ]
then
    if [ $1 == "-stop" ]
    then
        docker-compose -f iot-multichain/docker-compose-client.yml -p iot-client down --rmi all
        rm -r iot-multichain
    else 
        echo "Run without flags for running containers"
        echo "Run with flag -stop for stopping containers"
    fi
    exit
fi

read -p "Client name: " clientName
read -p "Blockchain master node address: " masterNodeAddress
read -p "Master Node network port for connections: " networkPort
read -p "Chain name: " chainName

echo "Updating package sources"
apt -y update && apt -y upgrade

echo "Installing git, docker and docker compose"
apt -y install docker.io
apt -y install docker-compose
apt -y install git

echo "Cloning source files"
git clone 'https://github.com/GokulRaj-R/iot-multichain.git'

cd iot-multichain/
echo "MASTER_NODE=$masterNodeAddress" >> docker-multichain/node/env
echo "NETWORK_PORT=$networkPort" >> docker-multichain/node/env
echo "CHAINNAME=$chainName" >> docker-multichain/node/env
echo "HOST_NAME=$clientName" >> node-client/.env

docker-compose -f docker-compose-client.yml -p iot-client up