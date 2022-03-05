ARG BASE_VERSION=1.1.0
FROM iteratec/multichain-base:${BASE_VERSION}
LABEL maintainer="nils.kuhn@iteratec.com"

ADD ./runchain.sh /root/runchain.sh
RUN chmod a+x /root/runchain.sh

CMD ["/bin/bash", "/root/runchain.sh"]
