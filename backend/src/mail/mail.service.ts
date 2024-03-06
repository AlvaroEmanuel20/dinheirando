import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import CustomBusinessError from 'src/shared/utils/CustomBusinessError';

interface MailMetadata {
  to: string;
  subject?: string;
  plainText?: string;
  html?: string;
  templateId?: number;
  params?: any;
}

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  private async getTestTransport() {
    const testAccount = await nodemailer.createTestAccount();
    const mailConfig = {
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    };

    return nodemailer.createTransport(mailConfig);
  }

  private async sendTestMail(
    mailData: MailMetadata,
    fromEmailName: string,
    fromEmail: string
  ) {
    const transporter = await this.getTestTransport();
    const info = await transporter.sendMail({
      from: `"${fromEmailName}" <${fromEmail}>`,
      to: mailData.to,
      subject: mailData.subject,
      text: mailData.plainText,
      html: mailData.html,
    });

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  async sendMail({
    to,
    subject,
    plainText,
    html,
    templateId,
    params,
  }: MailMetadata) {
    const env = this.configService.get<'dev' | 'prod'>('MAIL_ENV');
    const fromEmail = this.configService.get<string>('FROM_EMAIL');
    const fromEmailName = this.configService.get<string>('FROM_EMAIL_NAME');
    const replyEmail = this.configService.get<string>('REPLY_EMAIL');

    if (env === 'dev') {
      return await this.sendTestMail(
        { to, subject, plainText, html },
        fromEmailName,
        fromEmail
      );
    }

    const apiKey = this.configService.get<string>('SENDIN_BLUE_API_KEY');
    const emailConfig = {
      subject,
      textContent: plainText,
      htmlContent: html,
      sender: { name: fromEmailName, email: fromEmail },
      to: [{ email: to }],
      replyTo: { email: replyEmail },
      templateId: Number(templateId),
      params,
    };

    try {
      const url = 'https://api.brevo.com/v3/smtp/email';
      const res = await axios.post(url, emailConfig, {
        headers: { 'api-key': apiKey },
      });

      return res.data;
    } catch (error) {
      throw new CustomBusinessError('Error to send confirmation email', 500);
    }
  }
}
