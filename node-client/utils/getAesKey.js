const crypto = require('crypto');
const { rpcPort, rpcHost, rpcUser, rpcPass, privateKey, authorizedNodeStream, hostName } = require("../configs/config");

const mchain = require("multichain-node")({
    port: rpcPort,
    host: rpcHost,
    user: rpcUser,
    pass: rpcPass,
});

const decryptKeyWithRsaPrivateKey = (privateKey64, toDecrypt) => {
    let buffer = Buffer.from(toDecrypt, 'base64');
    const priKey = Buffer.from(privateKey64, 'base64').toString('utf8');
    const decrypted = crypto.privateDecrypt(priKey, buffer);
    return decrypted.toString('base64');
}

const getAesKey = () => {
    return new Promise((resolve, reject) => {
        mchain.listStreamKeyItems(
            {
                stream: authorizedNodeStream,
                key: hostName,
                count: 1,
            },
            (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err)
                }

                let encryptedAESKey = result[0].data.json.encryptedAESKey;
                const aesKeyBase64 = decryptKeyWithRsaPrivateKey(privateKey, encryptedAESKey);
                let aesKey = Buffer.from(aesKeyBase64, 'base64').toString('utf8');

                resolve(JSON.parse(aesKey));
            }
        );
    });
}

module.exports = getAesKey;