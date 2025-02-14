import { createTransport, type SentMessageInfo } from "nodemailer";
import type { MailOptions } from "nodemailer/lib/json-transport";

export default class Mail {
  private transport = {
    port: process.env.ENABLE_SSL === "true" ? 465 : 587,
    secure: process.env.ENABLE_SSL === "true", // true for 465, false for other ports
  };

  constructor(private options: MailOptions = {}) {
    options.from = {
      address: process.env.EMAIL as string,
      name: "Ambientech",
    };
    options.subject = "Notificação Ambientech";
  }

  public async send(): Promise<SentMessageInfo> {
    const transporter = createTransport({
      auth: {
        pass: process.env.EMAIL_PASSWORD,
        user: process.env.EMAIL,
      },
      host: process.env.SMTP_SERVER,
      ...this.transport,
    });

    if (process.env.ENABLE_SENDMAIL === "true") {
      return transporter.sendMail(this.options);
    }
    return null;
  }
}
