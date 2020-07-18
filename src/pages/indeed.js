const request = require('request-promise')
const cheerio = require('cheerio')

var job = ''
var city = ''
var uf = ''

const indeedNavegation = async (msg, ctx) => {
    try {
        job = msg.job.replace(' ', '+')
        city = msg.city.replace(' ', '+')
        uf = msg.uf.replace(' ', '+')
    } catch (e) {
       // return ctx.reply('Por favor insira a mensagem de forma correta')
    }

    const htmlResult = await request.get(`https://www.indeed.com.br/jobs?q=${job}&l=${city}%2C+${uf}`)
    //const htmlResult = await request.get(`https://www.indeed.com.br/jobs?q=programador+web&l=Belo+Horizonte%2C+MG`)
    const $ = await cheerio.load(htmlResult)
    let jobs = []
    $('.jobsearch-SerpJobCard').each((index, element) => {
        const jobInfo = {
            title: $(element).find('.title > a').attr('title'),
            company: $(element).find('.company').text().replace(/\n*/g, ''),
            location: $(element).find('.location').text(),
            remote: $(element).find('.remote').text() ? $(element).find('.remote').text().replace(/\n*/g, '') : 'Não',
            salary: $(element).find('.salaryText').text().replace(/\n*/g, '') ? $(element).find('.salaryText').text().replace(/\n*/g, '') : 'Não informado',
            date: $(element).find('.date').text(),
            link: 'https://www.indeed.com.br' + $(element).find('.title > a').attr('href')
        }
        console.log(jobInfo)
        jobs.push(`Título: ${jobInfo.title}\nEmpresa: ${jobInfo.company}\nData: ${jobInfo.date}\nLocal: ${jobInfo.location}\nRemoto: ${jobInfo.remote}\nSalário: ${jobInfo.salary}\nLink: ${jobInfo.link}`)
    })
    console.log(jobs)
    return jobs
}

module.exports = indeedNavegation