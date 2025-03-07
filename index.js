import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

app.post('/api/contact', async (req, res) => {
  const { name, email, company, message } = req.body
  console.log('Mottatt data:', req.body)
  console.log('Forespørsel mottatt:', req.method, req.url, req.body);

  try {
    await transporter.sendMail({
      from: `"Kontaktskjema" <${process.env.EMAIL_FROM}>`,
      to: 'kimtskht@gmail.com',
      subject: `Ny melding fra ${name}`,
      text: `
            Navn: ${name}
            E-post: ${email}
            Firma: ${company ? company : 'Ikke oppgitt'}
            Melding:
            ${message}
`
    })
    res.status(200).send('E-post sendt!')
  } catch (error) {
    console.error('Feil ved sending av e-post:', error)
    res.status(500).send('Kunne ikke sende e-post')
  }
})

app.listen(3000, () => console.log('✅ Backend kjører på http://localhost:3000'))
