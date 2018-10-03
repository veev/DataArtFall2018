const fs = require('fs')

// use file system (fs) to read the text file
const text = fs.readFileSync('../data/time-machine.txt', 'utf-8')
// console.log(text)

// split the text on the *** which marks the beginning and end of the book
const txtArray = text.split('***')
// console.log(txtArray.length)

// print out the lengths of each portion that was split at ***
txtArray.forEach( t => console.log(t.length))

// the book portion is at index 2 according to the length of the characters
const book = txtArray[2]

// make a JSON object with key / value pairs
const fileInfo = {}
fileInfo['author'] = 'H. G. Wells'
fileInfo.title = 'The Time Machine'
fileInfo.text = book

// use file system (fs) to write out a new JSON file - stringify since we made a JSON object
fs.writeFileSync('data/time-machine-clean.json', JSON.stringify(fileInfo), 'utf-8')
