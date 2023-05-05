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
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(TransactionalToken.name)
    private readonly transactionalTokenModel: Model<TransactionalToken>,
    private readonly mailService: MailService,
    private readonly transactionalTokenService: TransactionalTokensService,
    private readonly configService: ConfigService,
  ) {}

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.userModel.findOne({ email: data.email }).orFail();

    await this.transactionalTokenModel.deleteOne({ user: user._id });
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
    const storedPasswordToken = await this.transactionalTokenModel.findOne({
      token,
    });

    if (!storedPasswordToken) throw new Error('Blocked password token');

    const payload = await this.transactionalTokenService.verify(token);
    await this.userModel.findById(payload.userId).orFail();
    return token;
  }

  async putResetPassword(data: PutResetPasswordDto) {
    const storedPasswordToken = await this.transactionalTokenModel.findOne({
      token: data.token,
    });

    if (!storedPasswordToken) throw new Error('Blocked password token');

    const payload = await this.transactionalTokenService.verify(data.token);
    if (payload) {
      await this.userModel
        .findByIdAndUpdate(payload.userId, {
          password: await hash(data.password, 10),
        })
        .orFail();
    }

    await this.transactionalTokenModel.deleteOne({ token: data.token });
  }
}
