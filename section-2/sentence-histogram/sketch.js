function setup() {
	createCanvas(1200, 2000)
	loadJSON('../data/time-machine-clean.json', loadText)
}

function loadText(file) {
	console.log('loaded', file)

	// use regex to find the sentences withtin the text, search for punctuation marks like . ! ?
	const sentences = file.text.match(/[^\.!\?]+[\.!?]+/g)

	console.log('the book is ' + sentences.length + 'sentences long')

	// make an array for all the character lengths of the sentences
	const sentencesLengths = sentences.map( sentence => {
		const numChars = sentence.length
		return numChars
	})

	console.log("Longest is " + max(sentencesLengths) + " chars long")
	console.log("Shortest is " + min(sentencesLengths) + " chars long")

	// make the histogram
	sentencesLengths.forEach( (sL, i) => {
		console.log(sL, i)
		let x = 0
		let y = 0
		let w = map(sL, min(sentencesLengths), max(sentencesLengths), 2, width - 10)
		// color the line according to whether the word time appears in the sentence (red), if not blue
		sentences[i].toLowerCase().indexOf('time') > 0 ? fill(255, 0, 0) : fill(0, 0, 255)
		noStroke()
		rect(x, y + i, w, 1)
	})
}