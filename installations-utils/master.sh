#!/bin/bash

#================================================================
# HEADER
#================================================================
#% SYNOPSIS
#+    ${SCRIPT_NAME} [-stop]
#%
#% DESCRIPTION
#%    This script configures and runs the multichain master node.
#%
#% OPTIONS
#%    -stop                         Stops master node and deletes all docker images
#%
#% EXAMPLES
#%    ${SCRIPT_NAME}
#%        Start the multichain master
#%
#%    $}SCRIPT_NAME} -stop
#%        Stop multichain master node and remove all docker images
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
        docker-compose -f iot-multichain/docker-compose-master.yml -p iot-master down --rmi all
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
read -p "Chain name: " chainName

echo "Updating package sources"
apt -y update # && apt -y upgrade

echo "Installing git, node, docker and docker compose"
apt -y install docker.io
apt -y install docker-compose
apt -y install git
apt -y install nodejs

echo "Cloning source files"
# git clone 'https://github.com/GokulRaj-R/iot-multichain.git'
# cd iot-multichain/
mkdir iot-multichain
cd iot-multichain
git init
git remote add -f origin 'https://github.com/GokulRaj-R/iot-multichain.git'

echo "multichain/master" >> .git/info/sparse-checkout
echo "node-master" >> .git/info/sparse-checkout
echo "node-client" >> .git/info/sparse-checkout
echo "keygen.js" >> .git/info/sparse-checkout
echo "mosquitto.conf" >> .git/info/sparse-checkout
echo "docker-compose-master.yml" >> .git/info/sparse-checkout
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

echo "CHAINNAME=$chainName" >> multichain/master/env
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
docker-compose -f docker-compose-master.yml -p iot-master up
