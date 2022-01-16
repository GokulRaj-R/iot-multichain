const { RPCUSERNAME,
    RPCPASSWORD,
    RPCPORT,
    RPCHOST,
    AES_KEY,
    PUBLIC_KEY_STREAM,
    AUTHORIZED_NODE_STREAM,
} = process.env;

const config = {
    rpcUser: RPCUSERNAME,
    rpcPass: RPCPASSWORD,
    rpcPort: RPCPORT,
    rpcHost: RPCHOST || "127.0.0.1",
    aesKey: AES_KEY,
    publicKeyStream: PUBLIC_KEY_STREAM,
    authorizedNodeStream: AUTHORIZED_NODE_STREAM
};









