const crypto = require('crypto');

const { RPCUSERNAME,
    RPCPASSWORD,
    RPCPORT,
    RPCHOST,
    AES_KEY,
    PUBLIC_KEY_STREAM,
    AUTHORIZED_NODE_STREAM,
    PRIVATE_KEY,
    HOST_NAME
} = process.env;

const mchain = require("multichain-node")({
    port: RPCPORT,
    host: RPCHOST,
    user: RPCUSERNAME,
    pass: RPCPASSWORD,
});

const decryptKeyWithRsaPrivateKey = (privateKey, toDecrypt) => {
    let buffer = Buffer.from(toDecrypt, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
}

const getAesKey = () => {
    try {
        mchain.listStreamKeyItems(
            {
                stream: AUTHORIZED_NODE_STREAM,
                key: HOST_NAME,
                count: 1,
            },
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json(err);
                }

                const encryptedAESKey = result[0].data.json.encryptedAESKey;
                return decryptKeyWithRsaPrivateKey(PRIVATE_KEY, encryptedAESKey);
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json("Interval Server Error");
    }
}

const config = {
    rpcUser: RPCUSERNAME,
    rpcPass: RPCPASSWORD,
    rpcPort: RPCPORT,
    rpcHost: RPCHOST || "127.0.0.1",
    aesKey: getAesKey(),
    publicKeyStream: PUBLIC_KEY_STREAM,
    authorizedNodeStream: AUTHORIZED_NODE_STREAM
};









