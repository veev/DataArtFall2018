let populations;
let objArray = [];

function preload() {
  populations = loadTable("../data/simpleData_noRegions.csv", "csv", "header");
}

function setup() {
  // put setup code here
  console.log(populations.getRowCount() + " total rows in table");
  console.log(populations.getColumnCount() + " total columns in table");

  // how do we want to work with our Table Data?
  console.log(populations.getObject());

  console.log(populations.getArray());

  console.log(populations.getRows());

  // What if we want to work with an Array of Objects - let's create that
  // Create an array of objects - declare it globally to access it in draw function too

  for (let i = 0; i < populations.getRowCount(); i++) {

    // get the object from each CSV row - country, estimate, margin of error
    //console.log(populations.getRow(i));
    let oldObj = populations.getRow(i).obj;

    let newObj = {};
    newObj.country = oldObj.country;
    // interpret as a number instead of a string with parseInt
    newObj.estimate = parseInt(oldObj.estimate);
    newObj.error = parseInt(oldObj.marginOfError);
    // put the object into the array
    objArray.push(newObj);
  }

  console.log(objArray);
}

function draw() {
  // put drawing code here

  // How might you sort the countries by population estimate?

  // How might you visually represent the population estimates?
  // Try a few different ways
  // Think about shape, color, text
  // Once you feel comfortable with drawing a static representation, think about adding interactivity
}