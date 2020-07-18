const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

const indeedNavegation = require('./pages/indeed')
const linkedinNavigation = require('./pages/linkedin')
const cathoNavegation = require('./pages/catho')
const vagasNavigation = require('./pages/vagas')

const messageTreatment = require('./middleware/messageTreatment')
const scrapRequest = require('./functions/scrapRequest')

const messageMenu = require('./bot_commands/messageMenu')
const messageGo = require('./bot_commands/message_go')
const messageBack = require('./bot_commands/message_back')

const sendAdviseEmail = require('./functions/sendEmail')

var msg = ''
var messageArray = ''
var finalMessageArray = []
var i = 0

bot.start(ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Bem Vindo(a), esse bot irá procurar emprego para você no Catho, Vagas, Linkedin e no Indeed.\nPara mais detalhes, use /help')
})

bot.command('job', async (ctx) => {
    if (ctx.message.text === '/job') {
        return ctx.reply('Siga o modelo abaixo:\n/job Cargo - Cidade, UF')
    }
    msg = await messageTreatment(ctx)
    if (msg == null) {
        return ''
    }
    bot.telegram.sendMessage(ctx.chat.id, `Selecione o site que o bot irá pesquisar`, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Linkedin', callback_data: 'linkedin' },
                    { text: 'Vagas', callback_data: 'vagas' },
                ],
                [
                    { text: 'Catho', callback_data: 'catho' },
                    { text: 'Indeed', callback_data: 'indeed' }
                ],
                [
                    { text: 'Todos', callback_data: 'all' }
                ]
            ]
        }
    })
})

//The two bot actions below uses Cheerio and request methods for scraping
bot.action('indeed', async ctx => {
    if (msg === undefined) return ''
    ctx.deleteMessage()
    ctx.answerCbQuery()
    ctx.reply('Iniciando pesquisa, isso pode levar alguns minutos')
    finalMessageArray = await indeedNavegation(msg)
    let i = 0
    await messageMenu(ctx, finalMessageArray, i)
})

bot.action('vagas', async (ctx) => {
    ctx.deleteMessage()
    ctx.answerCbQuery()
    ctx.reply('Iniciando pesquisa, isso pode levar alguns minutos')
    finalMessageArray = await vagasNavigation(msg)
    if (finalMessageArray.length == 0) {
        return ctx.reply('nenhum emprego encontrado!')
    }
    await messageMenu(ctx, finalMessageArray, i = 0)
})

//The two bot actions below uses browser automation, so I can make a class for padronazing them
bot.action('linkedin', async ctx => {
    if (msg === undefined) return ''
    ctx.deleteMessage()
    ctx.answerCbQuery()
    ctx.reply('Iniciando pesquisa, isso pode levar alguns minutos')
    finalMessageArray = await scrapRequest(linkedinNavigation, msg, ctx)
    if (finalMessageArray.length == 0) {
        return ctx.reply('nenhum emprego encontrado!')
    }
    await messageMenu(ctx, finalMessageArray, i = 0)
})

bot.action('catho', async ctx => {
    ctx.answerCbQuery()
    ctx.deleteMessage()
    ctx.reply('Iniciando pesquisa, isso pode levar alguns minutos')
    finalMessageArray = await scrapRequest(cathoNavegation, msg, ctx)
    if (finalMessageArray.length == 0) {
        return ctx.reply('nenhum emprego encontrado!')
    }
    await messageMenu(ctx, finalMessageArray, i = 0)
})

//This command is basically all of those above
bot.action('all', async ctx => {
    ctx.answerCbQuery()
    ctx.deleteMessage()
    ctx.reply('Iniciando pesquisa, isso pode levar alguns minutos')

    //Indeed
    messageArray = await indeedNavegation(msg, ctx)
    try {
        messageArray.map(msg => {
            finalMessageArray.push(msg)
        })   
    } catch (e) {
        throw e
    }
    
    //Vagas
    messageArray = await vagasNavigation(msg, ctx)
    messageArray.map(msg => {
        finalMessageArray.push(msg)
    })

    //Linkedin
    messageArray = await scrapRequest(linkedinNavigation, msg, ctx)
    messageArray.map(msg => {
        finalMessageArray.push(msg)
    })

    //Catho
    messageArray = await scrapRequest(cathoNavegation, msg, ctx)
    messageArray.map(msg => {
        finalMessageArray.push(msg)
    })
    if(finalMessageArray.length == 0) {
        return ctx.reply('Nenhum emprego encontrado!')
    }
    await messageMenu(ctx, finalMessageArray, i = 0)
})

bot.action('go', async ctx => {
    i = await messageGo(ctx, finalMessageArray, i)
})

//The two actions below are the buttons put in the message array show in telegram chat
bot.action('back', async (ctx) => {
    i = await messageBack(ctx, finalMessageArray, i)
})

bot.command('help', ctx => {
    ctx.reply(`/job - procura emprego pra você em 4 sites diferentes\n/email - reporte algum problema ou entre em contato com o criador`)
})

bot.command('email', async ctx => {
    let message = ctx.message.text
    await sendAdviseEmail(message.replace('/email', ''))
    ctx.reply('mensagem enviada com sucesso!')
})

module.exports = bot