const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require('fs')

puppeteer.use(StealthPlugin())
const { executablePath } = require('puppeteer')

// Websites
const website = 'https://ca.indeed.com'

// Scraper Function
const scrape = async (url) => {
    const browser = await puppeteer.launch({ headless: 'new', executablePath: executablePath() })
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage()
    await page.goto(`${url}/jobs?q=Developer&l=Waterloo`)

    const jobs = []
    const amount = 3
    while (jobs.length < amount) {
        await page.waitForSelector('span');

        const extractedData = await page.evaluate(async () => {
            const data = Array.from(document.querySelectorAll('.jcs-JobTitle'))
            return data.map((item) => ({
                title: item.querySelector('span').innerText,
                link: item.getAttribute('href')
            }))
        })

        for (const data of extractedData) {
            await page.click(`span[title="${data.title}"`)
            await page.waitForTimeout(1500)

            const jobObject = await page.evaluate(async (data, url) => {
                const job = document.querySelector('.fastviewjob')
                const jobObject = {
                    title: data.title,
                    company: job.querySelector('.css-1f8zkg3.e19afand0').innerText,
                    location: job.querySelector('div[data-testid="inlineHeader-companyLocation"] div').innerText,
                    description: job.querySelector('#jobDescriptionText').innerText,
                    link: url + data.link
                }

                return jobObject
            }, data, url)

            if (jobs.length < amount) {
                jobs.push(jobObject)
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

    fs.writeFile('jobs.json', JSON.stringify(jobs), (error) => {
        if (error) throw error;
        console.log('File saved')
    })
    await browser.close()
}

module.exports = {
    website,
    scrape
}