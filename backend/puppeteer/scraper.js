const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require('fs')

puppeteer.use(StealthPlugin())
const { executablePath } = require('puppeteer')

// Websites
const website = 'https://ca.indeed.com'

// Scrape Titles Function w/ Pagination
const scrapeTitles = async (page, amount) => {
    let titles = []

    while (titles.length < amount) {
        await page.waitForSelector('span');
        const extractedData = await page.evaluate(async () => {
            const titlesData = Array.from(document.querySelectorAll('.jcs-JobTitle'))
            return titlesData.map((item) => item.querySelector('span').innerText)
        })

        for (const data of extractedData) {
            if (titles.length < amount) {
                titles.push(data)
            } else {
                break;
            }
        }

        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        const nextButton = await page.$('a[data-testid="pagination-page-next"]');
        if (nextButton) {
            await page.click('a[data-testid="pagination-page-next"]');
        } else {
            break;
        }
    }

    return titles
}

// Scraper Function
const scrape = async (url) => {
    const browser = await puppeteer.launch({ headless: 'new', executablePath: executablePath() })
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage()
    await page.goto(`${url}/jobs?q=Developer&l=Waterloo`)

    const titles = await scrapeTitles(page, 25)

    fs.writeFile('titles.json', JSON.stringify(titles), (error) => {
        if (error) throw error;
        console.log('File saved')
    })
    await browser.close()
}

module.exports = {
    website,
    scrape
}