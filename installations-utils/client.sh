#!/bin/bash

#================================================================
# HEADER
#================================================================
#% SYNOPSIS
#+    ${SCRIPT_NAME} [-stop]
#%
#% DESCRIPTION
#%    This script configures and runs the multichain client node.
#%
#% OPTIONS
#%    -stop                         Stops client node and deletes all docker images
#%
#% EXAMPLES
#%    ${SCRIPT_NAME}
#%        Start the multichain client
#%
#%    $}SCRIPT_NAME} -stop
#%        Stop multichain client node and remove all docker images
#%
#================================================================
# END_OF_HEADER
#================================================================

 #== needed variables ==#
SCRIPT_HEADSIZE=$(head -200 ${0} |grep -n "^# END_OF_HEADER" | cut -f1 -d:)
SCRIPT_NAME="$(basename ${0})"

  #== usage functions ==#
usage() { printf "Usage: "; head -${SCRIPT_HEADSIZE:-99} ${0} | grep -e "^#+" | sed -e "s/^#+[ ]*//g" -e "s/\${SCRIPT_NAME}/${SCRIPT_NAME}/g" ; }
usagefull() { head -${SCRIPT_HEADSIZE:-99} ${0} | grep -e "^#[%+-]" | sed -e "s/^#[%+-]//g" -e "s/\${SCRIPT_NAME}/${SCRIPT_NAME}/g" ; }
scriptinfo() { head -${SCRIPT_HEADSIZE:-99} ${0} | grep -e "^#-" | sed -e "s/^#-//g" -e "s/\${SCRIPT_NAME}/${SCRIPT_NAME}/g"; }

if [ $# -eq 1 ]
then
    if [ $1 == "-stop" ]
    then
        docker-compose -f iot-multichain/docker-compose-client.yml -p iot-client down --rmi all
        rm -r iot-multichain
    elif [ $1 == "--help" ] 
    then
        usagefull
    elif [ $1 == "-h" ] 
    then
        usagefull
    else 
        echo "Run ${SCRIPT_NAME} --help for available options"
    fi
    exit
fi

read -p "Client name: " hostName
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
# git clone 'https://github.com/GokulRaj-R/iot-multichain.git'
# cd iot-multichain/
mkdir iot-multichain
cd iot-multichain
git init
git remote add -f origin 'https://github.com/GokulRaj-R/iot-multichain.git'

echo "multichain/node" >> .git/info/sparse-checkout
echo "node-client" >> .git/info/sparse-checkout
echo "keygen.js" >> .git/info/sparse-checkout
echo "mosquitto.conf" >> .git/info/sparse-checkout
echo "docker-compose-client.yml" >> .git/info/sparse-checkout
git pull origin master

echo "Generating public-private key pair"
arr=( $(node keygen.js) )
# echo ${arr[0]}
# echo ${arr[1]}

publicKey=${arr[0]}
privateKey=${arr[1]}

echo "Exporting keys to environment variables"
export PUBLIC_KEY=$publicKey
export PRIVATE_KEY=$privateKey

echo "MASTER_NODE=$masterNodeAddress" >> multichain/node/env
echo "NETWORK_PORT=$networkPort" >> multichain/node/env
echo "CHAINNAME=$chainName" >> multichain/node/env
echo "HOST_NAME=$hostName" >> node-client/.env
echo "PRIVATE_KEY=$privateKey" >> node-client/.env
echo "PUBLIC_KEY=$publicKey" >> node-client/.env

BLUE='\033[0;34m' # Blue Color
GRE='\033[0;32m' # Green Color
NC='\033[0m' # No Color

echo "==============================="
echo -e "${BLUE}PUBLIC_KEY${NC}"
echo "==============================="
echo -e "${GRE}$publicKey${NC}"

echo "Running docker containers"
docker-compose -f docker-compose-client.yml -p iot-client up