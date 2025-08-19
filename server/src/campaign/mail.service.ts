import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendCampaignEmail(to: string, subject: string, content: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html: content, 
      });
      return true;
    } catch (err) {
      console.error("Mail send error:", err);
      return false;
    }
  }
}
