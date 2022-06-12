"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    sendActivationMail({ to, link }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transporter.sendMail({
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
            });
        });
    }
    sendResetPasswordMail({ to, link }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transporter.sendMail({
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
            });
        });
    }
    sendGeneratedPassword(to, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to: to,
                subject: `Weather Collector password`,
                text: ``,
                html: `
        <div>
          <h2>Ваш пароль для входу на сайті ${process.env.CLIENT_URL}</h2>
          <h3>${pass}</h3>
        </div>
      `,
            });
        });
    }
    sendNotificationMail(theme, message, userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transporter.sendMail({
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
            });
        });
    }
}
exports.mailService = new MailService();
//# sourceMappingURL=mail-service.js.map