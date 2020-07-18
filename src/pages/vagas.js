const request = require('request-promise')
const cheerio = require('cheerio')
const TinyURL = require('tinyurl')

var job = ''
var city = ''

const vagasNavigation = async (msg, ctx) => {
    console.log('função vagas!')
    try {
        job = msg.job.replace(' ', '-')
        city = msg.city.replace(' ', '-')
    } catch (e) {
       // return ctx.reply('Por favor insira a mensagem de forma correta')
    }

    const htmlResult = await request.get(`https://www.vagas.com.br/vagas-de-${job}-${city}`)
    const $ = await cheerio.load(htmlResult)

    let jobs = []
    $('#todasVagas > ul > li').each(async (index, element) => {
        const jobInfo = {
            title: $(element).find('h2 > a').text().replace(/\n\s*/g, ''),
            company: $(element).find('.emprVaga').text().replace(/\n\s*/g, ''),
            date: $(element).find('.data-publicacao').text(),
            desc: $(element).find('.detalhes > p').text(),
            link: 'https://www.vagas.com.br' + $(element).find('h2 > a').attr('href')
        }
        console.log(jobInfo)
        jobs.push(`Título: ${jobInfo.title}\nEmpresa: ${jobInfo.company}\nPublicado em: ${jobInfo.date}\nDescrição: ${jobInfo.desc}\nLink: ${jobInfo.link}`)
    })
    console.log(jobs)
    return jobs
}
module.exports = vagasNavigation