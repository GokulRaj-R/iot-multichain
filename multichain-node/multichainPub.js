const { rpcUser, rpcPass, rpcPort, rpcHost } = require("./configs/config");
const mchain = require("multichain-node")({
    port: rpcPort,
    host: rpcHost,
    user: rpcUser,
    pass: rpcPass,
});

const pubToMultichain = (stream, key, data) => {
    try {
        mchain.publish(
            { stream: stream, key: key, data: { json: data } },
            (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log("published to multichain-node");
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json("Interval Server Error");
    }
};

module.exports = pubToMultichain;
