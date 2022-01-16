const express = require("express");
const router = express.Router();

const { rpcUser, rpcPass, rpcPort, rpcHost } = require("../configs/config");
const mchain = require("multichain-node")({
	port: rpcPort,
	host: rpcHost,
	user: rpcUser,
	pass: rpcPass,
});

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
//				const data = result.map(ele=> ({temp: ele.data.json.temp, time:ele.data.json.timestamp}))
				const data = result.map(ele => ({...ele.data.json}));
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
				return res.json(result);
			}
		);
	} catch (err) {
		console.log(err);
		return res.status(500).json("Interval Server Error");
	}
});

module.exports = router;
