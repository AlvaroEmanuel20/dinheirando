import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { TransactionalTokensService } from 'src/transactionalTokens/transactionalTokens.service';
import { ConfigService } from '@nestjs/config';
import { PutResetPasswordDto, ResetPasswordDto } from './dto/users.dto';
import { hash } from 'bcryptjs';
import { TransactionalToken } from 'src/transactionalTokens/schemas/transactionalToken.schema';

@Injectable()
export class PasswordService {
  constructor(
    @InjectModel(User.name) private readonly User: Model<User>,
    @InjectModel(TransactionalToken.name)
    private readonly TransactionalToken: Model<TransactionalToken>,
    private readonly mailService: MailService,
    private readonly transactionalTokenService: TransactionalTokensService,
    private readonly configService: ConfigService,
  ) {}

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.User.findOne({ email: data.email }).orFail();

    await this.TransactionalToken.deleteOne({ user: user._id });
    const passwordToken = await this.transactionalTokenService.create(
      user.id as string,
      'PASSWORD',
    );

    const clientUrl = this.configService.get<string>('CLIENT_URL');
    const serverUrl = this.configService.get<string>('SERVER_URL');
    await this.mailService.sendMail({
      to: data.email,
      templateId: this.configService.get<number>(
        'RECOVER_PASSWORD_TEMPLATE_ID',
      ),
      params: {
        name: user.name,
        link: `${serverUrl}/password/reset/confirm?token=${passwordToken}`,
        newLink: `${clientUrl}/senha/resetar`,
      },
    });
  }

  async confirmResetPassword(token: string) {
    const storedPasswordToken = await this.TransactionalToken.findOne({
      token,
    });

    if (!storedPasswordToken) throw new Error('Blocked password token');

    const payload = await this.transactionalTokenService.verify(token);
    await this.User.findById(payload.userId).orFail();
    return token;
  }

  async putResetPassword(data: PutResetPasswordDto) {
    const storedPasswordToken = await this.TransactionalToken.findOne({
      token: data.token,
    });

    if (!storedPasswordToken) throw new Error('Blocked password token');

    const payload = await this.transactionalTokenService.verify(data.token);
    if (payload) {
      await this.User.findByIdAndUpdate(payload.userId, {
        password: await hash(data.password, 10),
      }).orFail();
    }

    await this.TransactionalToken.deleteOne({ token: data.token });
  }
}
