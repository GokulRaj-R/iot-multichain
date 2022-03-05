const express = require("express");
const publish = require("./apis/publish");

const app = express();
const PORT = process.env.MCBPORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/publish-key", publish);

app.get("/", (req, res) => {
    res.send("Multichain master node listening for public keys");
});

app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});
