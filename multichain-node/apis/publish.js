const express = require("express");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const pubToMultichain = require("../multichainPub")
const config = require("../configs/config")

const router = express.Router();

const encryptStringWithRsaPublicKey = function (toEncrypt, publicKey) {
    var buffer = Buffer.from(toEncrypt);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

router.post(
    "/",
    // body("stream", "Stream is required").notEmpty(),
    body("name", "Name is required").notEmpty(),
    // Data is required and must be a JSON object
    body("publicKey", "Public Key is required")
        .notEmpty(),
    (req, res) => {

        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        let { name, publicKey } = req.body;
        pubToMultichain(config.publicKeyStream, name, { name, publicKey });

        publicKey = Buffer.from(publicKey, 'base64').toString('utf8');
        const encryptedAESKey = encryptStringWithRsaPublicKey(config.aesKey, publicKey);
        pubToMultichain(config.authorizedNodeStream, name, { encryptedAESKey });

        res.json({msg: "Public Key published to multichain"});
    }
);

module.exports = router;
