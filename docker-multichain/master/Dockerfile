ARG BASE_VERSION=1.1.0
FROM iteratec/multichain-base:${BASE_VERSION}
LABEL maintainer="nils.kuhn@iteratec.com"

COPY ./runchain.sh /root/runchain.sh
COPY ./blocknotify.sh /root/blocknotify.sh
RUN chmod a+x /root/runchain.sh
RUN chmod a+x /root/blocknotify.sh

CMD ["/bin/bash", "/root/runchain.sh"]
