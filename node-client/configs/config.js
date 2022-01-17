const {
    RPCUSERNAME,
    RPCPASSWORD,
    RPCPORT,
    RPCHOST,
    PUBLIC_KEY_STREAM,
    AUTHORIZED_NODE_STREAM,
    PRIVATE_KEY,
    HOST_NAME
} = process.env;

const config = {
    rpcUser: RPCUSERNAME,
    rpcPass: RPCPASSWORD,
    rpcPort: RPCPORT,
    rpcHost: RPCHOST || "127.0.0.1",
    publicKeyStream: PUBLIC_KEY_STREAM,
    authorizedNodeStream: AUTHORIZED_NODE_STREAM,
    hostName: HOST_NAME,
    privateKey: PRIVATE_KEY
};

module.exports = config;







