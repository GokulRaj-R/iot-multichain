#!/bin/bash -x

# echo "Sleep for 30 seconds so the master node has initialised"
# sleep 30

echo "Setup /root/.multichain/multichain.conf"
mkdir -p /root/.multichain/
cat << EOF > /root/.multichain/multichain.conf
rpcuser=$RPC_USER
rpcpassword=$RPC_PASSWORD
rpcport=$RPC_PORT
EOF
for ip in ${RPC_ALLOW_IP//,/ } ; do
   echo "rpcallowip=$ip" >> /root/.multichain/multichain.conf
done

echo "Start the chain"
# multichaind -txindex -printtoconsole -shrinkdebugfilesize -debug=mcapi -debug=mchn -debug=mccoin -debug=mcatxo -debug=mcminer -debug=mcblock -rpcuser=$RPC_USER -rpcpassword=$RPC_PASSWORD $CHAINNAME@$MASTER_NODE:$NETWORK_PORT
multichaind -rpcuser=$RPC_USER -rpcpassword=$RPC_PASSWORD $CHAINNAME@$MASTER_NODE:$NETWORK_PORT -daemon
sleep 10 

echo "Setup /root/.multichain/$CHAINNAME/multichain.conf"
cat << EOF > /root/.multichain/$CHAINNAME/multichain.conf
rpcuser=$RPC_USER
rpcpassword=$RPC_PASSWORD
rpcport=$RPC_PORT
EOF

# echo "Starting chain daemon"
# multichaind $CHAINNAME -daemon 
# sleep 10

for ip in ${RPC_ALLOW_IP//,/ } ; do
   echo "rpcallowip=$ip" >> /root/.multichain/$CHAINNAME/multichain.conf
done

echo "Subscribing to streams"
( set -o posix ; set ) | sed -n '/_STREAM/p' | while read PARAM; do
   IFS='=' read -ra KV <<< "$PARAM"
   multichain-cli $CHAINNAME subscribe ${KV[1]} 
   sleep 3
done 

tail -f /dev/null
