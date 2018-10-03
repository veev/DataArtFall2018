let timeTravelerMatches
let index = 0
let count = 0
let period = 100

function setup() {
	createCanvas(1200, 800)
	loadJSON('../data/time-machine-clean.json', loadText)
}

function loadText(file) {
	console.log('loaded', file)

	// use the RiTa library to split text into sentences
	const sentences = RiTa.splitSentences(file.text)
	// console.log(sentences)

	// find sentences that follow the same part of speech pattern as the string: 'The Time Traveler was'
	timeTravelerMatches = searchByPOS(sentences, 'The Time Traveler was')
	console.log(timeTravelerMatches)
}

function draw() {
	// make sure we have an array of matching strings before trying to draw them
	if (timeTravelerMatches) {
		// settings to draw
		background(0)
		textSize(24)
		textAlign(CENTER, CENTER)
		fill(255)

		text(timeTravelerMatches[index], 0, 0, width, height)

		// code to cycle through sentences
		count++
		if (count === period) {
			if (index < timeTravelerMatches.length - 1) {
				index++
			} else {
				index = 0
			}
			count = 0
			if (period > 1) period--
		}
	}
}

function searchByPOS(array, posPattern) {
	// use RiTa to get part of speech pattern of string
	const pos = RiTa.getPosTags(posPattern)
	console.log(pos)

	// joing the array of parts of speech so we have a string to match against
	const posString = join(pos, ' ')
	// console.log(posString)

	// go through the sentences and see which have the same part of speech pattern
	const posMatches = array.filter((line, index) => {
		const poses = RiTa.getPosTags(line)

		const posesString = join(poses, ' ')
		// console.log(posesString)

		// return the ones that match
		return posesString.indexOf(posString) != -1
	})

	// return the array of matching sentences
	return posMatches
}