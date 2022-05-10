import nodemailer from 'nodemailer'


interface IMailService {
  to: string;
  link: string
}

class MailService {
  transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
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
}

export const mailService = new MailService()
