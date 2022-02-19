const crypto = require("crypto");

crypto.generateKeyPair(
  "rsa",
  {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  },
  (err, publicKey, privateKey) => {
    if (err) {
      console.log("Error generating key pair");
      throw err;
    }
    // console.log(publicKey);
    // console.log(privateKey);
    //
    // console.log("=========================================");
    // console.log("Public Key");
    // console.log("=========================================");
    console.log(Buffer.from(publicKey).toString("base64"));
    // console.log("\n");

    // console.log("=========================================");
    // console.log("Private Key");
    // console.log("=========================================");
    console.log(Buffer.from(privateKey).toString("base64"));
  }
);
