// download csv here: https://developer.here.com/documentation/geovisualization/topics/sample-datasets.html

const fs = require('fs')
// install node-csv-parse with npm
const parse = require('csv-parse/lib/sync')

const data = fs.readFileSync('../data/Mobile_activity_3months_scrambled.csv', 'utf8')
// console.log(data.length)
// console.log(data[10])
const parsedData = parse(data)
// console.log(parsedData.length)
// console.log(parsedData[9])

// what format do we want our data in order to put it on a map?
// GeoJson! What kind of geojson is it?
// Point - each coordinate is a point feature (instead of Line, Polygon or MultiPolygon)\

// Basic Format of Point feature in GeoJson
/*
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [ lon, lat] // for NYC [-73.984931, 40.755603]
  },
  "properties": {
    "timestep": val,
    "count": val
  }
}
*/

// Iterate through data array and create feature Point objects for each row
const geoJson = parsedData.map( row => {

  const featureObj = {}
  featureObj.type = "Feature"
  featureObj.geometry = {}
  featureObj.properties = {}

  featureObj.geometry.type = "Point"
  featureObj.geometry.coordinates = [row[1], row[0]]

  featureObj.properties.timestep = row[2]
  featureObj.properties.count = +row[3]

  return featureObj
}).filter( (feature, index) => index > 0 && feature.properties.timestep === '2') // remove first feature with the header info and only get data for first month

const geoJsonFeatureCollection = {}
geoJsonFeatureCollection.type = "FeatureCollection"
geoJsonFeatureCollection.features = geoJson

fs.writeFileSync('../data/Mobile_activity_1month_scrambled.geojson', JSON.stringify(geoJsonFeatureCollection, null, 4), 'utf8')
