const countries = []

function setup() {
	const width = 800, // canvas width and height
	height = 500,
	margin = 20,
	w = width - 2 * margin, // chart area width and height
	h = height - 2 * margin;

	//load data with d3, use data within the anonymous callback function
	d3.csv('../data/worldwide-health-lifeexpectancy-cut.csv', function(error, data) {
		if (error) throw error;
		console.log(data);
		// d3 map functions are useful for creating more convenient data structures
		// or applying transformations to values
		const mappedData = data.map( function(d) {
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
		const filteredData = mappedData.filter( function(d) {
			if (d.health != "" && d.life != "" && d.population != "") {
				return d;
			}
		});
		console.log(filteredData)

		// accessor functions which define how to get access to x, y, size and Data values, 
		// It makes it easier change visualization data: 
		// suppose you want d.health to be x-axis data instead of d.life. 
		// so you can just change it in one place instead of multiple
		// use the + sign to make sure the data is interpreted as a number, not a string
		const popData = function(d) {
			return +d.population
		};
		const healthData = function(d) {
			return +d.health
		};
		const lifeData = function(d) {
			return +d.life
		};

		console.log(d3.extent(filteredData, popData))
		console.log(d3.extent(filteredData, healthData))
		console.log(d3.extent(filteredData, lifeData))

		// x-scale
		const xScale = d3.scaleLinear()
			.domain([d3.min(filteredData, lifeData), d3.max(filteredData, lifeData)]) //set domain to [min,max] of data
			.range([margin, width - margin]) // set rage to chart area
			//.nice(); //make it nice (the end values will be nice round numbers)

		// same for y-scale
		const yScale = d3.scaleLinear()
			.domain([d3.min(filteredData, healthData), d3.max(filteredData, healthData)])
			.range([height - margin, margin])
			//.nice();

		const sizeScale = d3.scalePow()
			.exponent(0.5)
			.domain([d3.min(filteredData, popData), d3.max(filteredData, popData)])
			.range([10, 100]);

		// create canvas
		createCanvas(width, height);
		background(255);

		// create circles
		for (let i = 0; i < filteredData.length; i++) {
			const d = filteredData[i];
			fill(255, 0, 255, 50);
			noStroke();
			const c = new Country(
				d.name,
				xScale(lifeData(d)),
				yScale(healthData(d)),
				sizeScale(popData(d))
			);
			// add countries to array
			countries.push(c);
			//console.log(xScale(lifeData(d)), yScale(healthData(d)), sizeScale(popData(d)));
		}
	});
}

function draw() {
	background(255);
	// draw circles
	countries.forEach( function(c) {
		c.display();
	});
}

function Country(name, x, y, size) {
	this.name = name;
	this.pos = createVector(x, y);
	this.size = size;

	this.display = function() {
		if (this.isMouseOverCircle()) {
			fill(255, 0, 255, 255)
			ellipse(this.pos.x, this.pos.y, this.size, this.size)
			this.showName()
		} else {
			fill(255, 0, 255, 50)
			ellipse(this.pos.x, this.pos.y, this.size, this.size)
		}
	}

	this.showName = function() {
		fill(50);
		text(this.name, this.pos.x, this.pos.y);
	}

	this.isMouseOverCircle = function() {
		let distX = this.pos.x - mouseX;
		let distY = this.pos.y - mouseY;
		if (sqrt(sq(distX) + sq(distY)) < this.size / 2) {
			return true;
		} else {
			return false;
		}
	}
}