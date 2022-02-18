# docker-multichain

This is the repository for the iteratec/multichain-* docker images.

It is a fork of [kunstmaan's repository](https://github.com/Kunstmaan/docker-multichain).

Basically we updated the MultiChain binaries to latest v2 as of 2020-05-19. And we are 
using Enterprise version of MultiChain.

## Images

* [iteratec/multichain-base](https://hub.docker.com/repository/docker/iteratec/multichain-base): 
    A base Ubuntu with the latest Multichain deamon installed.
* [iteratec/multichain-master](https://hub.docker.com/repository/docker/iteratec/multichain-master): 
    Based on the "base" image running a master node, creates a blockchain and runs it. 
    *Important: only for development if started with default parameters since any node can 
    connect, anyone can administer and the RPC interface is open to all.*
* [iteratec/multichain-node](https://hub.docker.com/repository/docker/iteratec/multichain-node): 
    Based on the same "base" image and connects to the master node.
* [iteratec/multichain-explorer](https://hub.docker.com/repository/docker/iteratec/multichain-explorer): 
    A node with the [multichain-explorer](https://github.com/MultiChain/multichain-explorer) installed.

## Running the cluster

Use this [docker-compose.yml](https://github.com/Kunstmaan/docker-multichain/blob/master/docker-compose.yml) and run:

```
sudo docker-compose up
```


## Persisting your chain

Add a volume

\<somewhere\>:/root/.multichain

## Configuration

### Masternode

To configure your chain, we use environment variables.

#### Required

* CHAINNAME: DockerChain
* NETWORK_PORT: 7447       # also expose this port!
* RPC_PORT: 8000           # also expose this port!
* RPC_USER: multichainrpc
* RPC_PASSWORD: 79pgKQusiH3VDVpyzsM6e3kRz6gWNctAwgJvymG3iiuz
* RPC_ALLOW_IP: 0.0.0.0/0.0.0.0

`RPC_ALLOW_IP` may contain multiple ip addresses/masks/cidr's, separated by a comma. Setting a single ip
works like this: 

    # will allow RPC from 23.24.25.26 only:
    -e RPC_ALLOW_IP=23.24.25.26 
    
While setting up multiple ip addresses could be done like this:

    # will allow RPC from 23.24.25.26, from 172.16.0.0/12 and from 34.35.36.37/255.255.255.0:
    -e RPC_ALLOW_IP=23.24.25.26,172.16.0.0/12,34.35.36.37/255.255.255.0  

#### Optional

* PARAM_<something descriptive>='<variable>|<value>' e.g: `PARAM_TARGET_BLOCK_SIZE='target-block-time|15'`

These variables can be set:

```
# Basic chain parameters

chain-protocol = multichain             # Chain protocol: multichain (permissions, native assets) or bitcoin
chain-description = MultiChain DockerChain # Chain description, embedded in genesis block coinbase, max 90 chars.
root-stream-name = root                 # Root stream name, blank means no root stream.
root-stream-open = true                 # Allow anyone to publish in root stream
chain-is-testnet = false                # Content of the 'testnet' field of API responses, for compatibility.
target-block-time = 15                  # Target time between blocks (transaction confirmation delay), seconds. (2 - 86400)
maximum-block-size = 8388608            # Maximum block size in bytes. (5000 - 1000000000)
maximum-chunk-size = 1048576            # Maximum chunk size for off-chain items in bytes. (256 - 16777216)
maximum-chunk-count = 1024              # Maximum number of chunks in one off-chain item. (16 - 2048)

# Global permissions

anyone-can-connect = false              # Anyone can connect, i.e. a publicly readable blockchain.
anyone-can-send = false                 # Anyone can send, i.e. transaction signing not restricted by address.
anyone-can-receive = false              # Anyone can receive, i.e. transaction outputs not restricted by address.
anyone-can-receive-empty = true         # Anyone can receive empty output, i.e. without permission grants, asset transfers and zero native currency.
anyone-can-create = false               # Anyone can create new streams.
anyone-can-issue = false                # Anyone can issue new native assets.
anyone-can-mine = false                 # Anyone can mine blocks (confirm transactions).
anyone-can-activate = false             # Anyone can grant or revoke connect, send and receive permissions.
anyone-can-admin = false                # Anyone can grant or revoke all permissions.
support-miner-precheck = true           # Require special metadata output with cached scriptPubKey for input, to support advanced miner checks.
allow-arbitrary-outputs = false         # Allow arbitrary (without clear destination) scripts.
allow-p2sh-outputs = true               # Allow pay-to-scripthash (P2SH) scripts, often used for multisig. Ignored if allow-arbitrary-outputs=true.
allow-multisig-outputs = true           # Allow bare multisignature scripts, rarely used but still supported. Ignored if allow-arbitrary-outputs=true.

# Consensus requirements

setup-first-blocks = 60                 # Length of initial setup phase in blocks, in which mining-diversity,
                                        # admin-consensus-* and mining-requires-peers are not applied. (1 - 31536000)
mining-diversity = 0.3                  # Miners must wait <mining-diversity>*<active miners> between blocks. (0 - 1)
admin-consensus-upgrade = 0.5           # <admin-consensus-upgrade>*<active admins> needed to upgrade the chain. (0 - 1)
admin-consensus-txfilter = 0.5          # <admin-consensus-txfilter>*<active admins> needed to approve filter in the chain. (0 - 1)
admin-consensus-admin = 0.5             # <admin-consensus-admin>*<active admins> needed to change admin perms. (0 - 1)
admin-consensus-activate = 0.5          # <admin-consensus-activate>*<active admins> to change activate perms. (0 - 1)
admin-consensus-mine = 0.5              # <admin-consensus-mine>*<active admins> to change mining permissions. (0 - 1)
admin-consensus-create = 0.0            # <admin-consensus-create>*<active admins> to change create permissions. (0 - 1)
admin-consensus-issue = 0.0             # <admin-consensus-issue>*<active admins> to change issue permissions. (0 - 1)

# Defaults for node runtime parameters

lock-admin-mine-rounds = 10             # Ignore forks that reverse changes in admin or mine permissions after this many mining rounds have passed. Integer only. (0 - 10000)
mining-requires-peers = true            # Nodes only mine blocks if connected to other nodes (ignored if only one permitted miner).
mine-empty-rounds = 10                  # Mine this many rounds of empty blocks before pausing to wait for new transactions. If negative, continue indefinitely (ignored if target-adjust-freq>0). Non-integer allowed. (-1 - 1000)
mining-turnover = 0.5                   # Prefer pure round robin between a subset of active miners to minimize forks (0.0) or random equal participation for all permitted miners (1.0). (0 - 1)

# Native blockchain currency (likely not required)

initial-block-reward = 0                # Initial block mining reward in raw native currency units. (0 - 1000000000000000000)
first-block-reward = -1                 # Different mining reward for first block only, ignored if negative. (-1 - 1000000000000000000)
reward-halving-interval = 52560000      # Interval for halving of mining rewards, in blocks. (60 - 1000000000)
reward-spendable-delay = 1              # Delay before mining reward can be spent, in blocks. (1 - 100000)
minimum-per-output = 0                  # Minimum native currency per output (anti-dust), in raw units.
                                        # If set to -1, this is calculated from minimum-relay-fee. (-1 - 1000000000)
maximum-per-output = 100000000000000    # Maximum native currency per output, in raw units. (0 - 1000000000000000000)
minimum-offchain-fee = 0                # Minimum fee for publishing off-chain data items, per 1000 bytes, in raw units of native currency. (0 - 1000000000)
minimum-relay-fee = 0                   # Minimum transaction fee, per 1000 bytes, in raw units of native currency. (0 - 1000000000)
native-currency-multiple = 100000000    # Number of raw units of native currency per display unit. (0 - 1000000000)

# Advanced mining parameters

skip-pow-check = false                  # Skip checking whether block hashes demonstrate proof of work.
pow-minimum-bits = 8                    # Initial and minimum proof of work difficulty, in leading zero bits. (1 - 32)
target-adjust-freq = -1                 # Interval between proof of work difficulty adjustments, in seconds, if negative - never adjusted. (-1 - 4294967295)
allow-min-difficulty-blocks = false     # Allow lower difficulty blocks if none after 2*<target-block-time>.

# Standard transaction definitions

only-accept-std-txs = true              # Only accept and relay transactions which qualify as 'standard'.
max-std-tx-size = 4194304               # Maximum size of standard transactions, in bytes. (1024 - 100000000)
max-std-op-returns-count = 32           # Maximum number of OP_RETURN metadata outputs in standard transactions. (0 - 1024)
max-std-op-return-size = 2097152        # Maximum size of OP_RETURN metadata in standard transactions, in bytes. (0 - 67108864)
max-std-op-drops-count = 5              # Maximum number of OP_DROPs per output in standard transactions. (0 - 100)
max-std-element-size = 40000            # Maximum size of data elements in standard transactions, in bytes. (128 - 80000)
```

### Slavenode

To configure your chain, we use environment variables.

#### Required

* CHAINNAME: DockerChain
* NETWORK_PORT: 7447       # also expose this port!
* RPC_PORT: 8000           # also expose this port!
* RPC_USER: multichainrpc
* RPC_PASSWORD: 79pgKQusiH3VDVpyzsM6e3kRz6gWNctAwgJvymG3iiuz
* RPC_ALLOW_IP: 0.0.0.0/0.0.0.0
* MASTER_NODE: masternode   # IP address of the master node, or a docker compose link. Don't forget the links section!

`RPC_ALLOW_IP` may contain multiple ip addresses/masks/cidr's, separated by a comma. Setting a single ip
works like this: 

    # will allow RPC from 23.24.25.26 only:
    -e RPC_ALLOW_IP=23.24.25.26 
    
While setting up multiple ip addresses could be done like this:

    # will allow RPC from 23.24.25.26, from 172.16.0.0/12 and from 34.35.36.37/255.255.255.0:
    -e RPC_ALLOW_IP=23.24.25.26,172.16.0.0/12,34.35.36.37/255.255.255.0

### Releasing

Releases are done with automated builds in Docker-Hub. 
Releasing a new version of a docker image is triggered by pushing git-tags into the repository.
The 4 different images can be released seperately.
The git-tags need to match one of the following schemes:

git tag -a base-release-v1.0.0 -m "release v1.0.0 of base-image"
git tag -a base-release-demo-v1.0.0 -m "release v1.0.0 of base-image with MultiChain-demo version"
git tag -a node-release-v1.0.0 -m "release v1.0.0 of node-image"
git tag -a master-release-v1.0.0 -m "release v1.0.0 of master-image"
git tag -a explorer-release-v1.0.0 -m "release v1.0.0 of explorer-image"
"v1.0.0" gives the version number of the image.

Pushing the git-tag triggers the building of a new image
e.g. git push origin base-release-v1.0.0


