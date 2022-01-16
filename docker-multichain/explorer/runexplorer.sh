#!/bin/bash -x

echo "Sleep for 30 seconds so the master node has initialised"
sleep 30

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
multichaind -daemon -txindex -shrinkdebugfilesize -autosubscribe=assets,streams -debug=mcapi -debug=mchn -debug=mccoin -debug=mcatxo -debug=mcminer -debug=mcblock -rpcuser=$RPC_USER -rpcpassword=$RPC_PASSWORD $CHAINNAME@$MASTER_NODE:$NETWORK_PORT

cat << EOF > /root/.multichain/$CHAINNAME/multichain.conf
rpcuser=$RPC_USER
rpcpassword=$RPC_PASSWORD
rpcport=$RPC_PORT
EOF
for ip in ${RPC_ALLOW_IP//,/ } ; do
   echo "rpcallowip=$ip" >> /root/.multichain/$CHAINNAME/multichain.conf
done

echo "Sleep for 30 seconds so the slave node has initialised"
sleep 30

echo "Setup /root/.multichain/$CHAINNAME/multichain.conf"
echo "rpcport=$RPC_PORT" >> /root/.multichain/$CHAINNAME/multichain.conf


echo "Setup /root/explorer.conf"
cat << EOF > /root/explorer.conf
port 2750
host 0.0.0.0
datadir += [{
        "dirname": "~/.multichain/$CHAINNAME",
        "loader": "default",
        "chain": "MultiChain $CHAINNAME",
        "policy": "MultiChain"
        }]
dbtype = sqlite3
connect-args = dockerchain.explorer.sqlite
EOF

echo "Run the explorer"
python -m Mce.abe --config /root/explorer.conf --commit-bytes 100000 --no-serve
python -m Mce.abe --config /root/explorer.conf --no-load
