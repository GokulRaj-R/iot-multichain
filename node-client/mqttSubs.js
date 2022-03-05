const mqtt = require("mqtt");
const aesjs = require("aes-js");
const getAesKey = require('./utils/getAesKey');
const pubToMultichain = require("./multichainPub");

const host = process.env.MQTTHOST;
const port = process.env.MQTTPORT;
let AES_KEY;
// const AES_KEY = process.env.AES_KEY;

console.log(host);

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;

const topic = "room";

const subsToTopic = () => {
    const client = mqtt.connect(connectUrl, { clientId });

    client.on("connect", () => {
        console.log("Connected");
        client.subscribe([topic], () => {
            console.log("Subscribe to topic", topic);
        });
    });

    client.on("message", async (topic, payload) => {
        try{
            AES_KEY = AES_KEY || await getAesKey();
            const jsonData = JSON.parse(payload.toString());
            const { stream, key, data } = jsonData;
            console.log(jsonData);
            const textBytes = aesjs.utils.utf8.toBytes(JSON.stringify(data));
            const aesCtr = new aesjs.ModeOfOperation.ctr(AES_KEY);
            const encryptedBytes = aesCtr.encrypt(textBytes);
            const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
            pubToMultichain(stream, key, { encryptedHex });
        } catch(err) {
            console.log(err);
        }
    });
};

module.exports = subsToTopic;

