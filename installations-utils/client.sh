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

echo "Installing git, node, docker and docker compose"
apt -y install docker.io
apt -y install docker-compose
apt -y install git
apt -y install node

echo "Cloning source files"
git clone 'https://github.com/GokulRaj-R/iot-multichain.git'
cd iot-multichain/

echo "Generating public-private key pair"
arr=( $(node keygen.js) )
# echo ${arr[0]}
# echo ${arr[1]}

publicKey=${arr[0]}
privateKey=${arr[1]}

echo "Exporting keys to environment variables"
export PUBLIC_KEY=$publicKey
export PRIVATE_KEY=$privateKey

echo "MASTER_NODE=$masterNodeAddress" >> docker-multichain/node/env
echo "NETWORK_PORT=$networkPort" >> docker-multichain/node/env
echo "CHAINNAME=$chainName" >> docker-multichain/node/env
echo "HOST_NAME=$clientName" >> node-client/.env
echo "PRIVATE_KEY=$privateKey" >> node-client/.env

BLUE='\033[0;34m' # Blue Color
GRE='\033[0;32m' # Green Color
NC='\033[0m' # No Color

echo "==============================="
echo -e "${BLUE}PUBLIC_KEY${NC}"
echo "==============================="
echo -e "${GRE}$publicKey${NC}"

echo "Running docker containers"
docker-compose -f docker-compose-client.yml -p iot-client up


