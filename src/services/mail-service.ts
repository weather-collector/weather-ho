import nodemailer from 'nodemailer'


interface IMailService {
  to: string
  link: string
}

class MailService {
  transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  async sendActivationMail({to, link}: IMailService) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: `Weather Collector Activation on ${process.env.CLIENT_URL}`,
      text: ``,
      html: `
        <div>
          <h2>Для активації облікового запису перейдіть по наступному посиланню</h2>
          <a href="${link}">${link}</a>
        </div>
      `,
    })
  }

  async sendResetPasswordMail({to, link}: IMailService) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: `Password reset on ${process.env.CLIENT_URL}`,
      text: ``,
      html: `
        <div>
          <h2>Для зміни пароля облікового запису перейдіть по наступному посиланню</h2>
          <a href="${link}">${link}</a>
        </div>
      `,
    })
  }

  async sendGeneratedPassword(to: string, pass: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: `Weather Collector password`,
      text: ``,
      html: `
        <div>
          <h2>Ваш пароль для входу на сайті ${process.env.CLIENT_URL!}</h2>
          <h3>${pass}</h3>
        </div>
      `,
    })
  }

  async sendNotificationMail(theme: string, message: string, userEmail: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: theme,
      text: ``,
      html: `
        <div>
          <h3>${userEmail}</h3>
          <p>${message}</p>
        </div>
      `,
    })
  }
}

export const mailService = new MailService()
