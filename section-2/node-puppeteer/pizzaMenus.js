const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const yelpData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'yelp-inGoogle-pizza.json'), 'utf8'))

const baseUrl = `https://www.yelp.com`

async function run() {
  const browser = await puppeteer.launch({ headless: false }) // set headless to false if you want to see puppeteer in action
  const page = await browser.newPage()

  let idx = 0

  for (let i = idx; i < yelpData.length; i++) {
    const id = `${yelpData[i].id}`
    //let queryString = `https://www.yelp.com/menu/roccos-pizza-joint-new-york`
    const filename = `${id}.json`
    console.log(idx, id)
    await getRestaurantInfo(page, id, filename)
    idx++
  }

  await browser.close()
}

async function getRestaurantInfo(page, id, filename) {
  const queryStringMenu = `https://www.yelp.com/menu/${id}`
  const queryStringBiz = `https://www.yelp.com/biz/${id}`

  // get Restaurant Info
  await page.waitFor(randomIntFromInterval(900,1200))
  await page.goto(queryStringBiz)

  const CLOSED_SELECTOR = `#wrap > div.biz-country-us > div > div.top-shelf > div > div.alert.alert-error > p`
  const NAME_SELECTOR = `#wrap > div.biz-country-us > div > div.top-shelf > div > div.biz-page-header.clearfix > div.biz-page-header-left > div > h1`
  const PHONE_SELECTOR = `#wrap > div.biz-country-us > div > div.top-shelf > div > div.biz-page-subheader > div.mapbox-container > div > div.mapbox-text > ul > li:nth-child(4) > span.biz-phone`

  const isClosed = await page.evaluate((sel) => {
    let element = document.querySelector(sel)
    return element ? element.innerText : null
  }, CLOSED_SELECTOR)

  const name = await page.evaluate((sel) => {
    let element = document.querySelector(sel)
    return element ? element.innerText : null
  }, NAME_SELECTOR)

  const phone_number = await page.evaluate((sel) => {
    let element = document.querySelector(sel)
    return element ? element.innerText : null
  }, PHONE_SELECTOR)

  if (isClosed) {
    console.log('isClosed', isClosed)
    return
  }

  let fileInfo = {}
  fileInfo.name = name
  fileInfo.phone = phone_number
  // console.log(fileInfo)

  // get Menu Stuff
  await page.waitFor(randomIntFromInterval(900,1200))
  await page.goto(queryStringMenu)

  const MENU_SELECTOR = `#super-container > div.container.biz-menu > div.menu-header > ul > li:nth-child(2)`

  const menuType = await page.evaluate((sel) => {
    let element = document.querySelector(sel)
    return element ? element.innerText : null
  }, MENU_SELECTOR)

  console.log('menuType:', menuType)

  const PIZZA_INFO_SELECTOR = `#super-container > div.container.biz-menu > div.clearfix.layout-block.layout-a > div.column.column-alpha > div > div > h2`

  const mainPageSections = await page.evaluate((sel) => {
    let items = []
    let elements = document.querySelectorAll(sel)
    elements.forEach( el => {
      items.push(el.innerText)
    })
    return items
  }, PIZZA_INFO_SELECTOR)

  // console.log(mainPageSections)

  const hasPizzaSectionMainPage = mainPageSections.find( section => {
    return section.toLowerCase().includes('pizza')
  })

  console.log('hasPizzaSectionMainPage', hasPizzaSectionMainPage)

  if (hasPizzaSectionMainPage) {
    // Main Menu
    // stay on menu page
    console.log(menuType, 'stay on menu page')
    await getMenu(page, id, filename, fileInfo)
    
  } else if (menuType !== null) {
    // Pizza Sub Menu Case
    console.log(menuType, 'go to submenu page')

    const MENU_SECTION_SELECTOR = `#super-container > div.container.biz-menu > div.clearfix.layout-block.layout-a > div.column.column-alpha > ul > li`

    const submenuLinks = await page.evaluate((sel) => {
      let items = []
      let elements = document.querySelectorAll(sel)
      elements.forEach( el => {
        let link = el.querySelector('a')
        if (link) items.push(link.href)
      })
      return items
    }, MENU_SECTION_SELECTOR)

    //console.log(submenuLinks)

    const pizzaLink = submenuLinks.find( href => {
      return href.includes('pizza')
    })

    console.log('pizzaLink', pizzaLink)

    if (pizzaLink) {
      await page.goto(pizzaLink)
      await getMenu(page, id, filename, fileInfo)
    } else {
      return
    }
  } else {
    console.log('not a menu page - skip')
    return
  }
}

async function getMenu(page, id, filename, fileInfo) {
  const PIZZA_MENU_ROW_ITEM = `#super-container > div.container.biz-menu > div.clearfix.layout-block.layout-a > div.column.column-alpha > div > div > div` // > div > div.arrange_unit.arrange_unit--fill > div`
  const menuItems = await page.evaluate((sel) => {
    let items = []
    const rows = document.querySelectorAll(sel)
    
    rows.forEach( row => {
      let menuItem = {}
      if (row.querySelector('h4')) {
        menuItem.name = row.querySelector('h4').innerText
      }
      if (row.querySelector('p')) {
        menuItem.description = row.querySelector('p').innerText
      }
      if (row.querySelector('div.menu-item-prices.arrange_unit > ul > li.menu-item-price-amount')) {
        menuItem.price = row.querySelector('div.menu-item-prices.arrange_unit > ul > li.menu-item-price-amount').innerText
      }
      if (row.querySelector('div.menu-item-prices.arrange_unit > table > tbody')) {
        const prices = row.querySelectorAll('div.menu-item-prices.arrange_unit > table > tbody > tr')
        const priceArray = []
        prices.forEach( price => {
          let priceInfo = {}
          if (price.querySelector('th')) {
            priceInfo.description = price.querySelector('th').innerText
          }
          if (price.querySelector('td')) {
            priceInfo.amount = price.querySelector('td').innerText
          }
          priceArray.push(priceInfo)
        })
        menuItem.price = priceArray
      }
      items.push(menuItem)
    })
    return items
  }, PIZZA_MENU_ROW_ITEM)

  //console.log(menuItems)

  if (menuItems.length > 0) {
    fileInfo.restaurant_id = id
    fileInfo.menu = menuItems
    fs.writeFileSync(path.join(__dirname, `..`, `data`, `pizza_menus_yelp_2`, filename), JSON.stringify(fileInfo, null, 4), 'utf8')
    console.log(`saved menu for ${fileInfo.name}`)
  } else {
    console.log(`no menu for ${id}`)
  }
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

run()