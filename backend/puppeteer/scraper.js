const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())
const { executablePath } = require('puppeteer')

// Websites
const website = 'https://ca.indeed.com'

// Keywords
const keywords = [
    'Developer',
    'Full Stack',
    'Backend',
    'Software Engineer',
    'Developer Intern',
    'Engineer Intern',
    'Entry Level Developer',
    'Entry Level Engineer'
]

// Scraper Function
const extract = async (url, title, location, datePosted) => {
    // Launch puppeteer and go to website to scrape
    const browser = await puppeteer.launch({ headless: false, executablePath: executablePath() })
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage()

    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.resourceType() === 'document')
            request.continue()
        else
            request.abort()
    });

    await page.goto(`${website}/jobs?q=${title}&l=${location}`)

    await runFilter(page, datePosted)
    const jobs = await scrape(page, url)
    await browser.close()

    return jobs
}

// Filters
const runFilter = async (page, datePosted) => {
    const datePostedButton = await page.waitForSelector('#filter-dateposted')
    if (datePostedButton) {
        await page.click('#filter-dateposted')
        const element = (await page.$x(`//a[contains(text(), "Last ${datePosted}")]`))[0]
        if (element) {
            await page.evaluate((element) => {
                element.click()
            }, element);
        }
    }

    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });
}

const scrape = async (page, url) => {
    const extractedDataArray = []
    while (true) {
        const resultsExist = await page.$('.resultContent')
        if (resultsExist) {
            const extractedData = await page.$$eval('.resultContent', (extractedData) => {
                return extractedData.map((item) => ({
                    title: item.querySelector('.jcs-JobTitle span').innerText,
                    company: item.querySelector('span[data-testid="company-name"]').innerText,
                    location: item.querySelector('div[data-testid="text-location"]').innerText,
                    link: item.querySelector('.jcs-JobTitle').getAttribute('href')
                }))
            })
            extractedDataArray.push(...extractedData)

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
        } else {
            break;
        }
    }

    const jobs = []
    for (const data of extractedDataArray) {
        const jobObject = await page.evaluate((data, url) => {
            const jobObject = {
                title: data.title,
                company: data.company,
                location: data.location,
                link: url + data.link
            }
            return jobObject
        }, data, url)
        jobs.push(jobObject)
    }

    return jobs
}


module.exports = {
    extract,
    keywords,
    website
}