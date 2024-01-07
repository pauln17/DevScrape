const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require('fs')

puppeteer.use(StealthPlugin())
const { executablePath } = require('puppeteer')

// Websites
const website = 'https://ca.indeed.com'

// Scraper Function
const extract = async (url, title, location, locationType, jobType, datePosted, limit) => {
    // Launch puppeteer and go to website to scrape
    const browser = await puppeteer.launch({ headless: 'new', executablePath: executablePath() })
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage()
    await page.goto(`${url}/jobs?q=${title}&l=${location}`)

    // Handle search filters / forms
    await runFilters(page, locationType, jobType, datePosted)

    // Scrape data by retrieving titles from the cards first, then using those titles to click on each card to scrape the right panel that appears
    await page.screenshot({ path: 'test.png' })
    const jobs = await scrape(page, url, limit)

    // Write contents to a jobs.json file
    fs.writeFile('jobs.json', JSON.stringify(jobs), (error) => {
        if (error) throw error;
        console.log('File saved')
    })
    await browser.close()
}

// Filters
const runFilters = async (page, locationType, jobType, datePosted) => {
    const datePostedButton = await page.$('#filter-dateposted');
    if (datePostedButton) {
        await page.click('#filter-dateposted')
        const element = (await page.$x(`//a[contains(text(), "Last ${datePosted}")]`))[0]
        await page.waitForTimeout(500);

        await page.evaluate((element) => {
            element.click()
        }, element);
        await page.waitForTimeout(1500);
    }

    const locationTypeButton = await page.$('#filter-remotejob');
    if (locationTypeButton) {
        await page.click('#filter-remotejob')
        const element = (await page.$x(`//a[contains(text(), "${locationType}")]`))[0]
        await page.waitForTimeout(500);

        await page.evaluate((element) => {
            element.click()
        }, element);
        await page.waitForTimeout(1500);
    }

    const jobTypeButton = await page.$('#filter-jobtype')
    if (jobTypeButton) {
        await page.click('#filter-jobtype')
        const element = (await page.$x(`//a[contains(text(), "${jobType}")]`))[0]
        await page.waitForTimeout(500);

        await page.evaluate((element) => {
            element.click()
        }, element);
        await page.waitForTimeout(1500);
    }
}

const scrape = async (page, url, limit) => {
    const jobs = []

    while (jobs.length < limit) {
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

            if (jobs.length < limit) {
                jobs.push(jobObject)
            } else {
                break;
            }
        }

        // Pagination
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

    return jobs
}

module.exports = {
    website,
    extract
}