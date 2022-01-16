const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const crypto = require("cryto");
const path = require("path")
const fs =  require('fs')

const { rpcUser, rpcPass, rpcPort, rpcHost } = require("../configs/config");
const mchain = require("multichain-node")({
    port: rpcPort,
    host: rpcHost,
    user: rpcUser,
    pass: rpcPass,
})

var encryptStringWithRsaPublicKey = function(toEncrypt, publicKey) {
    // var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
    // var publicKey = fs.readFileSync(absolutePath, "utf8");
    var buffer = Buffer.from(toEncrypt);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

router.post(
    "/",
    // body("stream", "Stream is required").notEmpty(),
    body("name", "Name is required").notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const {  name  } = req.body;
        try {
            const publicKey = await getItemFromStream(config.authorizedStream, name);
            const encryptedAESKey = encryptStringWithRsaPublicKey(config.aesKey, publicKey)
            mchain.publish(
                { stream: stream, key: name, data: { json: {publicKey} } },
                (err, result) => {
                    if (err) {
                        return res.status(400).json(err);
                    }
                    return res.json(result);
                }
            );
        } catch (err) {
            console.log(err);
            return res.status(500).json("Interval Server Error");
        }
    }
);

module.exports = router;