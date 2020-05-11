const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => { 
    sgMail.send({
        to: email,
        from: 'lmalquran@gmail.com',
        subject: 'Welcome!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'lmalquran@gmail.com',
        subject: 'We Are Sad To See You Go!', 
        text: `We are sad to see you go, ${name}! We wish you the best of luck! Please let us know if there is anything we could have done better`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}