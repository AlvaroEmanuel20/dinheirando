import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendinApiV3Sdk from '@sendinblue/client';
import * as nodemailer from 'nodemailer';

interface MailMetadata {
  to: string;
  subject: string;
  plainText?: string;
  html?: string;
}

@Injectable()
export class MailService {
  private readonly apiSendinBlue: SendinApiV3Sdk.TransactionalEmailsApi;
  private smtpEmailSendinBlue: SendinApiV3Sdk.SendSmtpEmail;

  constructor(private readonly configService: ConfigService) {
    this.apiSendinBlue = new SendinApiV3Sdk.TransactionalEmailsApi();
    this.smtpEmailSendinBlue = new SendinApiV3Sdk.SendSmtpEmail();
  }

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
    fromEmail: string,
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

  async sendMail({ to, subject, plainText, html }: MailMetadata) {
    try {
      const env = this.configService.get<'dev' | 'prod'>('MAIL_ENV');
      const fromEmail = this.configService.get<string>('FROM_EMAIL');
      const fromEmailName = this.configService.get<string>('FROM_EMAIL_NAME');

      if (env === 'dev') {
        await this.sendTestMail(
          { to, subject, plainText, html },
          fromEmailName,
          fromEmail,
        );
      } else {
        const apiKey = this.configService.get<string>('SENDIN_BLUE_API_KEY');
        const replyEmail = this.configService.get<string>('REPLY_EMAIL');

        this.apiSendinBlue.setApiKey(
          SendinApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
          apiKey,
        );

        this.smtpEmailSendinBlue = {
          subject,
          textContent: plainText,
          htmlContent: html,
          sender: { name: fromEmailName, email: fromEmail },
          to: [{ email: to }],
          replyTo: { email: replyEmail },
        };

        await this.apiSendinBlue.sendTransacEmail(this.smtpEmailSendinBlue);
      }
    } catch (error) {
      console.log(error);
      return error as Error;
    }
  }
}
