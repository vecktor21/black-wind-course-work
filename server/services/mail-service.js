const nodemailer = require('nodemailer')
class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            post: process.env.SMTP_PORT,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWWORD
            },
            secure: false
        })
    }

    async sendEmail(to, subject, text, html){
        try {
            this.transporter.sendMail({
                from:process.env.SMTP_USER,
                to,
                subject,
                text,
                html
            })
        }catch (e) {
            console.log(e)
        }
    }
}
module.exports = new MailService()