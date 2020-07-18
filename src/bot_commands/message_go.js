const messageMenu = require('./messageMenu')

const messageGo = async (ctx, messageArray, i) => {
    if (i < messageArray.length) {
        ctx.deleteMessage();
        i++
        try {
            await messageMenu(ctx, messageArray, i)
        } catch (e) {
            await messageMenu(ctx, messageArray, i - 1)
        }
        return i
    }
}


module.exports = messageGo