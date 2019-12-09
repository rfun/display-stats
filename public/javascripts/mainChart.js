var margin = { top: 20, right: 20, bottom: 30, left: 40 },
	width = 1040 - margin.left - margin.right,
	height = 700 - margin.top - margin.bottom

var parseDate = d3.isoParse

var x = d3.time.scale().range([0, width])

var y = d3.scale.linear().range([height, 0])

var color = d3.scale.category10()

var xAxis = d3.svg
	.axis()
	.scale(x)
	.orient("bottom")

var yAxis = d3.svg
	.axis()
	.scale(y)
	.orient("left")

var svg = d3
	.select("body")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var line = d3.svg
	.line()
	.interpolate("basis")
	.x(function(d) {
		return x(d.date)
	})
	.y(function(d) {
		return y(d.value)
	})

d3.json("http://localhost:3000/chartData", function(error, data) {
	if (error) throw error

	color.domain(
		d3.keys(data[0]).filter(function(d) {
			return d !== "date_time_stamp" && d !== "hostname"
		})
	)

	data.forEach(function(d) {
		d.date = parseDate(d.date_time_stamp)
	})

	var stats = color.domain().map(function(name) {
		return {
			name: name,
			values: data.map(function(d) {
				return { date: d.date, value: +d[name] }
			})
		}
	})

	x.domain(
		d3.extent(data, function(d) {
			return d.date
		})
	)
	y.domain([
		d3.min(stats, function(c) {
			return d3.min(c.values, function(v) {
				return v.value
			})
		}),
		d3.max(stats, function(c) {
			return d3.max(c.values, function(v) {
				return v.value
			})
		})
	])

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)

	var stats = svg
		.selectAll(".stats")
		.data(stats)
		.enter()
		.append("g")
		.attr("class", "stats")

	stats
		.append("path")
		.attr("class", "line")
		.attr("data-legend", function(d) {
			return d.name
		})
		.attr("d", function(d) {
			return line(d.values)
		})
		.style("stroke", function(d) {
			return color(d.name)
		})

	legend = svg
		.append("g")
		.attr("class", "legend")
		.attr("transform", "translate(50,30)")
		.style("font-size", "12px")
		.call(d3.legend)

	setTimeout(function() {
		legend
			.style("font-size", "20px")
			.attr("data-style-padding", 10)
			.call(d3.legend)
	}, 1000)
})
