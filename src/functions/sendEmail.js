const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.EMAIL_TOKEN)

const sendAdviseEmail = (msg) => {
    sgMail.send({
        to: process.env.MY_EMAIL,
        from: process.env.SG_EMAIL,
        subject: 'DesempregadoBot message',
        text: `${msg}`
    }).catch((e) => {
        throw new e
    })
}

module.exports = sendAdviseEmail