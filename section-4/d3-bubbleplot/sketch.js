// Declare some global variables that define our svg
const width = 800, // canvas width and height
height = 500,
margin = 20,
w = width - 2 * margin, // chart area width and height
h = height - 2 * margin;

// Create scale ranges (what the data will map to: width, height, radius)
// We can create the scale and the range since we know the size we want
// for the display. The domain can be added later once the data is loaded
const xScale = d3.scaleLinear()
	.range([margin, width - margin]) // set the domain after loading data

// d3's origin is at the upper left top
// set yScale so that smaller values start at height of svg
// and larger values are closer to the top
const yScale = d3.scaleLinear()
	.range([height - margin, margin])

const sizeScale = d3.scalePow()
	.exponent(0.5)
	.range([10, 100]);

// Create the svg container to draw into
const svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g")

// Create an empty div for the tooltip
const tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.style("pointer-events", "none!important")
	.text("a simple tooltip")

// Load in our data
// v5 Promises way
d3.csv("../data/worldwide-health-lifeexpectancy-cut.csv").then(data => {
	console.log(data)

	// Map the data so it has better key names (accessors)
	// We need to use brackets instead of dot notation to access the existing keys
	// since they have spaces in the them - access as strings
	const mappedData = data.map( d => {
		return {
			name: d["Country Name"],
			code: d["Country Code"],
			health: d["2014 Health expenditure, total (% of GDP)"],
			life: d["2014 Life expectancy at birth, total (years)"],
			population: d["2014 Population, total"]
		};
	});
	console.log(mappedData)

	// filter out rows with fields that don't contain all data fields
	const filteredData = mappedData.filter( d => {
		if (d.health != "" && d.life != "" && d.population != "") {
			return d
		}
	})
	console.log(filteredData)

	// Set the domains of the scales using d3.extent
	// (returns the min and max of the data array)
	xScale.domain(d3.extent(filteredData, d => {
		return +d.life
	}))

	yScale.domain(d3.extent(filteredData, d => {
		return +d.health
	}))

	sizeScale.domain(d3.extent(filteredData, d => {
		return +d.population
	}))

	// Create our circles, one for each country
	// D3 selects svg elements before they exist
	// in order to bind data
	const circles = svg.selectAll("circle")
		.data(filteredData) // bind the data
		.enter() // update the subselection with data
		.append("circle") //append circle svg elements to svg context
		.attr("fill", d3.rgb(255, 0, 255)) // color the circle svg elements
		.attr("fill-opacity", 0.2) // make it so they are not fully opaque (since there is overlap)
		.attr("cx", d => {
			return xScale(+d.life) // the x coordinate comes from the xScale function, mapping the life key value of each data element to the width
		})
		.attr("cy", d => {
			return yScale(+d.health) // the y coordinate comes from the yScale function, mapping the health key value of each data element to the height
		})
		.attr("r", d => {
			return sizeScale(+d.population) / 2 // the radius comes from the sizeScale function (a power scale), mapping the population key value between 10 and 100
		})
	.on("mouseenter", () => {
			tooltip.style("visibility", "visible") // make sure it's visible on entering the element
			return tooltip
	})
	.on("mousemove", d => {
		tooltip.text(d.name) // update tooltip with data we want
		tooltip.style('left', d3.event.pageX + 'px') // position the tooltip based on mouseX and mouseY
        	 .style('top', d3.event.pageY - 28 + 'px');

		return tooltip
})
	.on("mouseout", () => {
			return tooltip.style("visibility", "hidden") // turn it off when you leave the element
	})
}).catch( e => {
	console.log(e)
})