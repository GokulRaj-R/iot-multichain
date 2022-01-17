const express = require("express");
const aesjs = require("aes-js");
const { rpcUser, rpcPass, rpcPort, rpcHost, aesKey } = require("../configs/config");
const mchain = require("multichain-node")({
    port: rpcPort,
    host: rpcHost,
    user: rpcUser,
    pass: rpcPass,
});

const router = express.Router();

/**
 * @param {hexString} data encrypted data 
 */
const decryptWithAesKey = (data) => {
    const encryptedHex = data;
    const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
    const aesCtr = new aesjs.ModeOfOperation.ctr(key);
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    const decryptedData = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return JSON.parse(decryptedData);
}

router.get("/:stream", (req, res) => {
    const { stream } = req.params;
    let { start, count, verbose } = req.query;

    verbose = verbose === "true" ? true : false;
    count = parseInt(count || 10000);
    start = parseInt(start || 0);

    try {
        mchain.listStreamItems(
            {
                stream: stream,
                verbose: verbose,
                count: count,
                start: start,
                'local-ordering': true
            },
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json(err);
                }

                // const data = result.map(ele => ({...ele.data.json}));
                const data = result.map(ele => {
                    return decryptWithAesKey(ele.data.json.encryptedHex);
                });

                return res.json(data);
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json("Interval Server Error");
    }
});

router.get("/:stream/keys", (req, res) => {
    const { stream } = req.params;
    let { start, count, verbose } = req.query;

    verbose = verbose === "true" ? true : false;
    count = parseInt(count || 1000);
    start = parseInt(start || 0);

    try {
        mchain.listStreamKeys(
            {
                stream: stream,
                key: "*",
                verbose: verbose,
                count: count,
                start: start,
            },
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json(err);
                }
                return res.json(result);
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json("Interval Server Error");
    }
});

router.get("/:stream/:key", (req, res) => {
    const { stream, key } = req.params;
    let { start, count, verbose } = req.query;

    verbose = verbose === "true" ? true : false;
    count = parseInt(count || 10000);
    start = parseInt(start || 0);

    try {
        mchain.listStreamKeyItems(
            {
                stream: stream,
                key: key,
                verbose: verbose,
                count: count,
                start: start,
            },
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json(err);
                }

                const data = result.map(ele => {
                    return decryptWithAesKey(ele.data.json.encryptedHex);
                });
                return res.json(data);
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json("Interval Server Error");
    }
});

module.exports = router;