const axios = require('axios')
const _ = require('lodash')

const messageTreatment = async (ctx) => {
    let message = ctx.message.text
    if (message === undefined) {
        return ctx.reply('mensagem inserida incorretamente!')
    }
    else {
        let messageArray = message.trim().replace(', ', ',').split('-') ? message.trim().replace(', ', ',').split('-') : message.trim().split('-')

        let location = messageArray[messageArray.length - 1].split(',') //array[array.length - 1]

        const UFsData = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')

        if(!location[1]) {
            ctx.reply('UF faltando!')
            return null
        }

        let correctUf = UFsData.data.filter(uf => uf.sigla == location[1].toUpperCase())
        
        if(correctUf.length === 0) {
            ctx.reply('Estado não encontrado!')
            return null
        }

        let thisCity = _.deburr(location[0]).toLowerCase().trim().replace(' ', '-')
       
        let city = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${thisCity}`)

        if(city.data.microrregiao.mesorregiao.UF.sigla == correctUf[0].sigla) {
            return {
                job: messageArray[0].replace('/job', '').trim(),
                city: thisCity,
                uf: correctUf[0].sigla
            }
        }
        else {
            ctx.reply('Estado e cidade não batem!')
            return null
        }
    }
}

module.exports = messageTreatment