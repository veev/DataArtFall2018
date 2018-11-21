// Declare some global variables that define our svg
const width = 800, // canvas width and height
height = 500,
margin = 20,
w = width - 2 * margin, // chart area width and height
h = height - 2 * margin;

// Create scale ranges (what the data will map to: width, height, radius)
let xScale = d3.scaleLinear()
	.range([margin, width - margin]); // set the domain after loading data

// d3's origin is at the upper left top
// set yScale so that smaller values start at height of div
// and larger values are closer to the top
let yScale = d3.scaleLinear()
	.range([height - margin, margin]); 

let sizeScale = d3.scalePow()
	.exponent(0.5)
	.range([10, 100]);

// Create the svg container to draw into
//create svg container
let svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g");

// Create empty tooltip
let tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.style("pointer-events", "none!important")
	.text("a simple tooltip");

// Load in our data
d3.csv("../data/worldwide-health-lifeexpectancy-cut.csv", function(error, data) {
	if (error) throw error;
	console.log(data);

	// Map the data so it has better column names (accessors)
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
	data = data.filter( d => {
		if (d.health != "" && d.life != "" && d.population != "") {
			return d;
		}
	});
	console.log(data);

	// Set the domains of the scales using d3.extent
	// (returns the min and max of the data array)
	xScale.domain(d3.extent(data, d => {
		return +d.life;
	}));

	yScale.domain(d3.extent(data, d => {
		return +d.health;
	}));

	sizeScale.domain(d3.extent(data, d => {
		return +d.population;
	}));

	//create our circles, one for each country data
	let circles = svg.selectAll("circle")
		.data(data) // bind the data
		.enter() // update the subselection with data
		.append("circle") //append circle svg elements to svg context
		.attr("fill", d3.rgb(255, 0, 255))
		.attr("fill-opacity", 0.2)
		.attr("cx", d => {
			return xScale(+d.life);
		})
		.attr("cy", d => {
			return yScale(+d.health);
		})
		.attr("r", d => {
			return sizeScale(+d.population) / 2;
		})
	.on("mouseenter", () => {
			// tooltip.text(d.name); // update tooltip with data we want
			tooltip.style("visibility", "visible") // make sure it's visible
			return tooltip
	})
	.on("mousemove", d => {
		tooltip.text(d.name);
		tooltip.style("left", d3.select(this).attr("cx") + "px")
					 .style("top", d3.select(this).attr("cy") + "px")
		return tooltip
})
	.on("mouseout", () => {
			return tooltip.style("visibility", "hidden");
	});
});