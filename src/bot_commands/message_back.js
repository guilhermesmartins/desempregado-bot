const messageMenu = require('./messageMenu')

const messageBack = async (ctx, messageArray, i) => {
    if (i != 0) { //If its zero the back button shouldnt continue working
        ctx.deleteMessage();
        i = i - 1
        await messageMenu(ctx, messageArray, i)
        return i
    }
}

module.exports = messageBack