const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

async function messageMenu(ctx, messageArray, iterator) {
    return bot.telegram.sendMessage(ctx.chat.id, messageArray[iterator], {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: `⬅️`, callback_data: 'back' },
                    { text: `${iterator+1}/${messageArray.length}`, callback_data: 'iChange' },
                    { text: `➡️`, callback_data: 'go' }
                ]
            ]
        }
    })
}

module.exports = messageMenu