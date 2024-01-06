const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require('fs')

puppeteer.use(StealthPlugin())
const { executablePath } = require('puppeteer')

// Websites
const websites = [
    'https://bot.sannysoft.com/',
    'https://www.linkedin.com/jobs/search'
]

// Scraper Function
const scrape = async (url) => {
    const browser = await puppeteer.launch({ headless: 'new', executablePath: executablePath() })
    const page = await browser.newPage()
    await page.goto(url)
    await page.screenshot({ path: 'bot.jpg' })

    fs.writeFile('data.json', JSON.stringify(null), (error) => {
        if (error) throw error;
        console.log('File saved')
    })
    await browser.close()
}

module.exports = {
    websites,
    scrape
}