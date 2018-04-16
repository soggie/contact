import http from 'http'
import validator from 'validator'
import jsonBody from 'body/json'
import nodemailer from 'nodemailer'

const sendmail = (name, email, company, phone, inquiry) => {
  const to = process.env.SENDMAIL_TO
  const host = process.env.SENDMAIL_SMTP_HOST
  const user = process.env.SENDMAIL_SMTP_USER
  const pass = process.env.SENDMAIL_SMTP_PASS
  const secure = process.env.SENDMAIL_SMTP_SECURE || true
  const port = process.env.SENDMAIL_SMTP_PORT || 587
  const subject = `[Website] New inquiry from ${email}`

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: user,
      pass: pass
    }
  })

  const mail = {
    from: '',
    to: to,
    subject: subject,
    text: `Test inquiry`,
    html: '<p>Test</p>'
  }

  console.log(user, pass, mail)

  return new Promise((resolve, reject) => {
    transporter.sendMail(mail, (err, info) => {
      if (err) {
        return reject(err)
      }

      resolve(info)
    })
  })
}

const server = http.createServer((req, res) => {
  jsonBody(req, {}, (err, body) => {
    // Take the body and check for the proper fields
    const name = body.name + ''
    const email = body.email + ''
    const company = body.company + ''
    const phone = body.phone + ''
    const inquiry = body.inquiry + ''

    // Make sure that all fields are filled up
    const errors = {}

    // If name is less than 3 characters, assume it's garbage
    if (name.length < 3) {
      errors.name = 'Please enter a valid name'
    }

    // Make sure there's an email address to revert to
    if (!validator.isEmail(email)) {
      errors.email = 'Please enter a valid email address'
    }

    // TODO: Add error checks

    sendmail(name, email, company, phone, inquiry)
      .then(info => res.end('Done'))
      .catch(err => {
        console.log(err)
        res.end('Error')
      })
  })
})

server.listen(Number.isInteger(process.env.PORT) ? process.env.PORT : 3000)