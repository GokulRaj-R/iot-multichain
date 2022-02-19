#!/bin/bash

if [ $# -eq 1 ]
then
    if [ $1 == "-stop" ]
    then
        docker-compose -f docker-compose-master.yml -p iot-master down --rmi all
    else 
        echo "Run without flags for running containers E.g ./master.sh"
        echo "Run with flag -stop for stopping containers E.g ./master.sh -stop"
    fi
    exit
fi

docker-compose -f docker-compose-master.yml -p iot-master up
