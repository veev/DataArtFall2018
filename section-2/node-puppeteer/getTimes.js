const puppeteer = require('puppeteer')

async function getTimes() {
  // essentially launching our own version of Chrome, setting it equal to the variable browser
  const browser = await puppeteer.launch()
  // set headless browser to false to see the program in action
  // const browser = await puppeteer.launch({ headless: false })
  // open a new page in the browser and assign it to the variable page
  const page = await browser.newPage()
  // navigate to the url www.nytimes.com
  await page.goto('https://www.nytimes.com/')
  // take a screenshot of the webpage, save it as nytimes.png
  await page.screenshot({path: 'nytimes.png'})
  // close the browser
  await browser.close()
}

getTimes()