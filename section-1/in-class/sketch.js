
//read in data from csv
// v4 + v3 callback way
// d3.csv('../data/nyc-data.csv', (error, data) => {
//  if (error) throw error
//  console.log(data)
// })

// v5 Promises way
d3.csv('../data/nyc-data.csv').then(data => {
  // console.log(data)
}).catch(e => {
  console.log(e)
})

// read in multiple data files with Promise.all
Promise.all([
  d3.csv('../data/nyc-data.csv'),
  d3.csv('../data/simpleData.csv')
]).then(([nycData, usaData]) => {
  console.log(nycData)
  // console.log(usaData)
  const processedNYC = processData(nycData, true)
  const processedUSA = processData(usaData, false)
})

function processData(data, isNYCData) {
  // change the property names (keys) of the objects in the data
  // convert the string values to numbers with the + operator (parseInt())
  // remove strings and excess characters before converting to numbers with replace() and slice()
  const mapped = data.map( d => {
    // console.log(d)
    return {
      'country': isNYCData ? d['country/region'] : d['country'], // turnary operator - acts like an "if/else" statement
      'population': +d['estimate'].replace(/,/g, ''),
      'marginOfError': +d.marginOfError.replace(/,/g, '').slice(3)
    }
  }).map( d =>  { return {...d, errorFraction: d.marginOfError / d.population} }) // spread operator (...) gets the values from the object passed into the function
  console.log(mapped)

  // filter out regions from data -- use an array of stop words
  const regionsToFilter = ['Europe', 'Asia', 'Africa', 'America', 'Caribbean', 'Subregion', 'excluding']
  const noRegions = mapped.filter( d => {
    //The every() method tests whether all elements in the array pass the test implemented by the provided function.
    return regionsToFilter.every( region => {
      // returns true if country names do not contain words in the RegionsToFilter array (stop words)
      return d.country.indexOf(region) === -1
    })
  })
  console.log(noRegions)

  // use reduce to get total foreign born population from countries, don't double count people from regions (why we filtered)
  const total = noRegions.reduce((acc, d) => acc + d.population, 0)
  console.log(total)

  // sort the array of countries in ascending order based on population, or descending order
  // for more information on sort: https://teamtreehouse.com/community/javascript-sort-method-how-does-the-comparison-actually-work
  // we slice the array we want to sort first in order to copy it and not mutate the original data or other arrays
  const ascendingPop = noRegions.slice(0).sort((a,b) => a.population - b.population)
  console.log(ascendingPop)
  const descendingPop = noRegions.slice(0).sort((a,b) => b.population - a.population)
  console.log(descendingPop)

  // return the data once it's processed how we want it
  return ascendingPop
}