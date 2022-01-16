const express = require("express");
const crypto = require("cryto");
const { body, validationResult } = require("express-validator");
const pubToMultichain = require("../multichainPub")

const router = express.Router();

const encryptStringWithRsaPublicKey = function (toEncrypt, publicKey) {
    var buffer = Buffer.from(toEncrypt);
    var encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
};

router.post(
    "/",
    // body("stream", "Stream is required").notEmpty(),
    body("name", "Key is required").notEmpty(),
    // Data is required and must be a JSON object
    body("publicKey", "Data is required")
        .notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        console.log(req.body);
        const { name, publicKey } = req.body;
        pubToMultichain(config.publicKeyStream, name, { publicKey });

        const encryptedAESKey = encryptStringWithRsaPublicKey(config.aesKey, publicKey);
        pubToMultichain(config.authorizedNodeStream, name, { encryptedAESKey });
    }
);

module.exports = router;
