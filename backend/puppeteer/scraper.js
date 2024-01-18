const Job = require('../models/job');
const { performance } = require('perf_hooks');
const loggers = require('../utils/loggers');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const anonymizeUaPlugin = require('puppeteer-extra-plugin-anonymize-ua');
const config = require('../utils/config');

puppeteer.use(anonymizeUaPlugin());
puppeteer.use(StealthPlugin());

// Website
const website = 'https://ca.indeed.com';
const proxyUrl = config.PROXY_URL;

// Keywords
const keywords = [
    'Developer',
    'Full Stack',
    'Backend',
    'Software Engineer',
    'Developer Intern',
    'Engineer Intern',
    'Entry Level Developer',
    'Entry Level Engineer',
];

// Scraper Function
const extract = async (location) => {
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: 'new',
            executablePath: '/usr/bin/google-chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.resourceType() === 'document') {
                request.continue();
            } else {
                request.abort();
            }
        });

        const jobsArray = [];
        try {
            const tempArray = [];
            for (const word of keywords) {
                const encodedUrl = encodeURIComponent(
                    `${website}/jobs?q=${word}&l=${location}&status=00&radius=50&fromage=7`
                );
                await page.goto(`${proxyUrl}${encodedUrl}`, {
                    waitUntil: 'domcontentloaded',
                });
                console.log(proxyUrl + encodedUrl);
                const jobs = await scrape(page, website, word, location);
                tempArray.push(...jobs);
            }

            for (const job of tempArray) {
                const index = jobsArray.findIndex((i) => i.title === job.title);
                if (index === -1) {
                    jobsArray.push(job);
                }
            }
        } finally {
            page.close();
        }

        return jobsArray;
    } catch (error) {
        if (error.name === 'TimeoutError') {
            console.error('Timeout Error:', error);
        } else if (error.name === 'NetworkError') {
            console.error('Network Error:', error);
        } else {
            console.error('An unexpected error occurred:', error);
        }

        if (browser) {
            await browser.close();
        }
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

const scrape = async (page, website, word, location) => {
    const extractedDataArray = [];
    let pageHasResults = true;
    let pageNumber = 0;

    while (pageHasResults) {
        const resultsExist = await page.$('.resultContent');
        if (resultsExist) {
            const extractedData = await page.$$eval(
                '.resultContent',
                (extractedData) => {
                    return extractedData.map((item) => ({
                        title: item.querySelector('.jcs-JobTitle span')
                            .innerText,
                        company: item.querySelector(
                            'span[data-testid="company-name"]'
                        ).innerText,
                        location: item.querySelector(
                            'div[data-testid="text-location"]'
                        ).innerText,
                        link: item
                            .querySelector('.jcs-JobTitle')
                            .getAttribute('href'),
                    }));
                }
            );
            extractedDataArray.push(...extractedData);

            // Pagination
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });

            const nextButton = await page.$(
                'a[data-testid="pagination-page-next"]'
            );
            if (nextButton && pageNumber < 3) {
                pageNumber += 1;
                const encodedUrl = encodeURIComponent(
                    `${website}/jobs?q=${word}&l=${location}&status=${pageNumber.toString()}0&radius=50&fromage=7`
                );
                await page.goto(`${proxyUrl}${encodedUrl}`, {
                    waitUntil: 'domcontentloaded',
                });
            } else {
                pageHasResults = false;
            }
        } else {
            pageHasResults = false;
        }
    }

    const jobs = [];
    for (const data of extractedDataArray) {
        const jobObject = await page.evaluate(
            (data, website) => {
                const jobObject = {
                    title: data.title,
                    company: data.company,
                    location: data.location,
                    link: website + data.link,
                };
                return jobObject;
            },
            data,
            website
        );
        jobs.push(jobObject);
    }

    return jobs;
};

const task = async () => {
    const t0 = performance.now();
    let session;

    try {
        session = await mongoose.startSession();

        await session.withTransaction(async () => {
            await Job.deleteMany({}).session(session);
            loggers.info('Scraping...');
            const jobs = await extract('Waterloo, ON');
            await Job.insertMany(jobs, { session });
        });

        await session.commitTransaction();
    } catch (error) {
        loggers.info('Extract Task Error: ', error);
    } finally {
        session.endSession();
    }

    const t1 = performance.now();
    loggers.info(
        'Scraper completed in ' +
            Math.floor(((t1 - t0) / 1000) * 1000) / 1000 +
            ' seconds'
    );
};

module.exports = {
    task,
};
