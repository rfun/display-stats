var express = require("express")
var router = express.Router()
var path = require("path")
var MongoClient = require("mongodb").MongoClient

router.get("/", function(req, res, next) {
	let filePath = path.resolve(__dirname, "../views/chart.html")
	res.sendFile(filePath)
})

router.get("/chartData", function(req, res, next) {
	MongoClient.connect("mongodb://localhost:27017", function(err, client) {
		const db = client.db("server_info")
		const collection = db.collection("metrics")

		// collection
		// 	.find({
		// 		date_time_stamp: {
		// 			$lt: new Date(),
		// 			$gte: new Date(new Date().setDate(new Date().getDate() - 1))
		// 		}
		// 	})
		// 	.toArray(function(err, items) {
		// 		if (err) {
		// 			return res.error(err)
		// 		}
		// 		res.json(items)
		// 		client.close()
		// 	})

		collection.find().toArray(function(err, items) {
			if (err) {
				return res.error(err)
			}
			res.json(items)
			client.close()
		})
	})
})

module.exports = router
