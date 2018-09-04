let populations;
let objArray = [];

function preload() {
  // Don't use preload() function for JSON files, 
  // currently a bug in p5 where it doesn't return JSON Arrays only JSON Objects
  // populations = loadJSON('../data/simpleData_noRegions.json');
}

function setup() {
  // put setup code here
  // load static data set here
  loadJSON('../data/simpleData_noRegions.json', callback);
}

function callback(data) {
  console.log('done loading data');
  console.log(data);
  populations = data;

  //if the data is loaded, start working with it
  if (populations) {
    for (let i = 0; i < populations.length; i++) {
      //console.log(populations[i]);
    
      let name = populations[i].country;
      let population = populations[i].estimate;
      //sampling error of the estimate, estimate could be + or - the margin of error
      let error = populations[i].marginOfError;
      
      //get magnitude of error compared to population estimate;
      let errorFraction =  populations[i].marginOfError / population;
      //console.log(errorFraction);
      
      console.log(name, population, error)
    }
  }
}

function draw() {
  // put drawing code here

  if (populations) {
    // How might you sort the countries by population estimate?

    // How might you visually represent the population estimates?
    // Try a few different ways
    // Think about shape, color, text
    // Once you feel comfortable with drawing a static representation, think about adding interactivity

  }
}