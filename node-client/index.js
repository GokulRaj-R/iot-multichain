const express = require("express");
const stream = require("./apis/stream");

const app = express();
const PORT = process.env.MCCPORT || 3002;

const subsToTopic = require('./mqttSubs')

app.use(express.json());
app.use("/stream", stream);

app.get("/", (req, res) => {
    res.send("Multichain client app.");
});

app.listen(PORT, () => {
    console.log(`Client app listening at port ${PORT}`);
});

subsToTopic();