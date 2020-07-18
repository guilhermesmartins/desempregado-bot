const puppeteer = require('puppeteer')
const TinyURL = require('tinyurl')

let browser = null
let page = null

const linkedinNavigation = {
    initialize: async () => {
        browser = await puppeteer.launch({
            headless: true
        })
        page = await browser.newPage()
    },
    pageNavigation: async (msg, ctx) => {
        try {
            let job = msg.job.replace(' ', '%20')
            let city = msg.city.replace(' ', '%20')
            await page.goto(`https://www.linkedin.com/jobs/search?keywords=${job}&location=${city}%20brasil&trk=public_jobs_jobs-search-bar_search-submit&redirect=false&position=1&pageNum=0`)
        } catch (e) {
           // return ctx.reply('Por favor insira a mensagem de forma correta')
        }
    },
    pageJobs: async() => {
        let jobsArray = await page.$$('ul.jobs-search__results-list > li')

        let jobs = []
        for (const job of jobsArray) {

            await page.click('li > a.result-card__full-card-link')

            const jobDetails = {
                title: await job.$eval('a > span.screen-reader-text', e => e.innerText),
                company: await job.$eval('h4', e => e.innerText),
                location: await job.$eval('li > div > div > span', e => e.innerText),
                date: await job.$eval('li > div > div > time', e => e.innerText),
                link: await job.$eval('li > a', e => e.getAttribute('href')),
               
            }
            //jobs.push(jobDetails)
            jobs.push(`Título: ${jobDetails.title}\nEmpresa: ${jobDetails.company}\nCidade: ${jobDetails.location}\nPostado em: ${await TinyURL.shorten(jobDetails.link)}`)
        }
        return jobs
    },
    end: async() => {
        console.log('stopping the scraper...')
        await browser.close()
    }
}

module.exports = linkedinNavigation