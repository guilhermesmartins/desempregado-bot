const puppeteer = require('puppeteer')
const TinyURL = require('tinyurl')

let browser = null
let page = null

const cathoNavigation = {
    initialize: async () => {
        browser = await puppeteer.launch({
            headless: true,
        })
        page = await browser.newPage()
    },
    pageNavigation: async (msg, ctx) => {
        try {
            let job = msg.job.replace(' ', '%20')
            let city = msg.city.replace(' ', '%20')   
            await page.goto(`https://www.catho.com.br/vagas/?pais_id=31&q=${job}%20${city}`)
        } catch (e) {
           // return ctx.reply('Por favor insira a mensagem de forma correta')
        }
    },
    pageJobs: async () => {
        console.log('catho scrap started')
        let jobsArray = await page.$$('li[data-gtm-title]')
        let jobs = []
        //let salaryArray = await page.$$eval('li[data-gtm-title]', e => e.getAttribute('data-gtm-dimension-41'))
        for (const jobElement of jobsArray) {
            await page.waitFor(1000)
            await jobElement.click('span.job-description + button')
            const jobInfo = {
                title: await jobElement.$eval('h2 > a', e => e.innerText),
                link: await jobElement.$eval('h2 > a', e => e.getAttribute('href')), //e.getAttribute('href')
                desc: await jobElement.$eval('li[data-gtm-title] span.job-description + button', e => e.getAttribute('aria-label')), //e.getAttribute('aria-label')
                location: await jobElement.$eval('button > a', e => e.getAttribute('title')), //e.getAttribute('title')
                date: await jobElement.$eval('time > span', e => e.innerText),
                //benefits: await jobElement.$eval('strong + p', e => e.innerText) ? await jobElement.$eval('strong + p', e => e.innerText) : 'Não informado',
            }
            //jobs.push(jobInfo)
            jobs.push(`TÍTULO: ${jobInfo.title}\nCIDADE: ${jobInfo.location}\nPUBLICADO EM: ${jobInfo.date}\nDESCRIÇÃO: ${jobInfo.desc}\nLINK: ${await TinyURL.shorten(jobInfo.link)}`)
                       //Benefícios: ${jobInfo.benefits}

        }
        console.log(jobs)
        return jobs
    },
    end: async () => {
        await browser.close()
    }
}

module.exports = cathoNavigation