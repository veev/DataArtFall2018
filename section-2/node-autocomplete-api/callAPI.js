const request  = require('request')
const fs = require('fs')

// var results = {
//  'how do i': [
//    'how do i live',
//    ...
//  ],
//  'what is': [
//    ...
//  ]
// }

const results = {}

// what search terms do you want to query?
const query = ['how do i', 'what is', 'anyone', 'i am', 'who are', 'i think']
const service = 'yt';
const language = 'en';

function concatenateUrl(query, service, language) {
  // this might be deprecated at any moment, but will work via node for now! It probably won't work if you query via the browser
  // More info here: https://webmasters.googleblog.com/2015/07/update-on-autocomplete-api.html
  const requestUrl = 'https://www.google.com/complete/search?&client=firefox' +
           '&q=' + query +
           '&ds=' + service +
           '&hl=' + language

  return requestUrl
}

function callAPI(i) {
  console.log('Called callAPI')
  console.log(query[i] + ', ' + service + ', ' + language)
  const url = concatenateUrl(query[i], service, language)

  // This is the actual API call
  request(url, function(error, response, body){
    // console.log(response);
    console.log(body)
    // This is all NATIVE javascript
    console.log(typeof body)   // My original data is just a string
    const result = JSON.parse(body)  // I need to convert it to a JSON object
    
    console.log(typeof result)
    const autocomplete = result[1] // Getting just the autocomplete suggestions
    console.log(autocomplete)

    results[query[i]] = autocomplete // add suggestions to results object, use query term as key
    console.log(results)

    i++
    if (i < query.length) {
      callAPI(i)
    } else {
      // write out query results to file when all terms in query array have been queried
      fs.writeFileSync('autocomplete_results.json', JSON.stringify(results, null, 4), 'utf-8');
    }
  });
}

// call the function the first time
callAPI(0)