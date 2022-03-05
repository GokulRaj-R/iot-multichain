const express = require("express");
const config = require("./configs/config")
const stream = require("./apis/stream");

const app = express();
const PORT = process.env.MCCPORT || 3002;

const subsToTopic = require('./mqttSubs')

app.use(express.json());
app.use("/stream", stream);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index", {
        hostName: hostName,
        publicKey: publicKey
    });
});

app.listen(PORT, () => {
    console.log(`Client app listening at port ${PORT}`);
});

subsToTopic();