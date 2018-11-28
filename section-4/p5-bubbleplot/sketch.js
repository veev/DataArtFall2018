// Bubblechart for life expectancy and health care spending
// Size circles according to spending? population?
const countries = []

function preload() {
	table = loadTable('../data/worldwide-health-lifeexpectancy-cut.csv', 'csv', 'header')
}

function setup() {
	console.log(table)

	const width = 800, // canvas width and height
	height = 500,
	margin = 20,
	w = width - 2 * margin, // chart area width and height
	h = height - 2 * margin

	createCanvas(width, height)
	background(255)

	const cleanData = []
	const healthspending = []
	const lifexpectancies = []
	const populations = []

	// for each row in table
	for (let r = 0; r < table.getRowCount(); r++) {
		// fill arrays for each type of data per country
		// table.getNum() is buggy, so use table.getString, then cast to a float
		const tempHealth = table.getString(r, "2014 Health expenditure, total (% of GDP)")
		const tempLifeX = table.getString(r, "2014 Life expectancy at birth, total (years)")
		const tempPop = table.getString(r, "2014 Population, total")

		console.log(tempHealth, tempLifeX, tempPop)
		
		// if any field is empty (NaN) skip data for that row (country)
		if (tempHealth != "" && tempLifeX != "" && tempPop != "") {
			healthspending.push(float(tempHealth))
			lifexpectancies.push(float(tempLifeX))
			populations.push(float(tempPop))
		}
	}
	// Make sure the arrays are all the same length
	// console.log(healthspending.length, lifexpectancies.length, populations.length);

	// console.log("population: ", min(populations), max(populations));
	// console.log("health spending: ", min(healthspending), max(healthspending));
	// console.log("life expectancy: ", min(lifexpectancies), max(lifexpectancies));

	for (let i = 0; i < table.getRowCount(); i++) {
		// make sure to deal with data as numbers, not strings
		const name = table.getString(i, "Country Name")
		const population = float(table.getString(i, "2014 Population, total"))
		const health = float(table.getString(i, "2014 Health expenditure, total (% of GDP)"))
		const lifeX = float(table.getString(i, "2014 Life expectancy at birth, total (years)"))
		console.log(population, health, lifeX)

		if (!isNaN(health) && !isNaN(lifeX) && !isNaN(population)) {
			// map the data to various dimensions - x position, y position and size of ellipse
			// map the sqrt of the population since the domain is so large
			const populationSize = map(sqrt(population), sqrt(min(populations)), sqrt(max(populations)), 10, 80)
			const lifeXPos = map(lifeX, min(lifexpectancies), max(lifexpectancies), margin, width - margin)
			const healthYPos = map(health, min(healthspending), max(healthspending), height - margin, margin)

			// Create a new circle object and store it in the countries array
			const c = new Country(name, lifeXPos, healthYPos, populationSize)
			countries.push(c)
		}
	}
}

function draw() {
	background(255)
	countries.forEach( function(c) {
		c.display()
	});
}

// Create a class for each Country and visualize it as a circle
function Country(name, x, y, size) {
	this.name = name
	this.pos = createVector(x, y)
	this.size = size

	this.display = function() {
		
		noStroke()
		
		if (this.isOverCircle()) {
			fill(255, 0, 255, 255)
			ellipse(this.pos.x, this.pos.y, this.size, this.size)
			this.showName()
		} else {
			fill(255, 0, 255, 50)
			ellipse(this.pos.x, this.pos.y, this.size, this.size)
		}
	}

	this.showName = function() {
		fill(50)
		textAlign(CENTER)
		text(this.name, this.pos.x, this.pos.y)
	}

	// mouseover logic to display name of country
	this.isOverCircle = function() {
		const distX = this.pos.x - mouseX
		const distY = this.pos.y - mouseY
		if (sqrt(sq(distX) + sq(distY)) < this.size / 2) {
			return true
		} else {
			return false
		}
	}
}