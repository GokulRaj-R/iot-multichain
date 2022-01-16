FROM ubuntu:bionic
LABEL maintainer="nils.kuhn@iteratec.com"

ENV DEBIAN_FRONTEND noninteractive
ENV LANG en_US.UTF-8
ENV LC_ALL C.UTF-8

# Set timezone to CET
RUN apt-get update && \
    apt-get -y install tzdata
RUN cp /usr/share/zoneinfo/CET /etc/localtime

ENV MULTICHAIN_VERSION 2.1.1-enterprise-demo

RUN apt-get update \
        && apt-get upgrade -q -y \
        && apt-get dist-upgrade -q -y \
        && apt-get install -q -y wget curl \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/* \
        && cd /tmp \
        && wget https://www.multichain.com/download/enterprise/multichain-${MULTICHAIN_VERSION}.tar.gz \
        && tar -xvzf multichain-${MULTICHAIN_VERSION}.tar.gz \
        && cd multichain-${MULTICHAIN_VERSION} \
        && mv multichaind multichain-cli multichain-util /usr/local/bin \
        && cd /tmp \
        && rm -Rf multichain*

CMD ["/bin/bash"]
