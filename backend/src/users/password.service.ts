import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { ServiceTokensService } from 'src/serviceTokens/serviceTokens.service';
import { ConfigService } from '@nestjs/config';
import { PutResetPasswordDto, ResetPasswordDto } from './dto/users.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class PasswordService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailService: MailService,
    private readonly serviceTokenService: ServiceTokensService,
    private readonly configService: ConfigService,
  ) {}

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.userModel.findOne({ email: data.email }).orFail();
    await this.serviceTokenService.deleteTokens(
      user.id,
      'TRANSACTIONAL_PASSWORD',
    );

    const token = await this.serviceTokenService.createTransactional(
      user.id,
      'TRANSACTIONAL_PASSWORD',
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
        link: `${serverUrl}/password/reset/confirm?token=${token}`,
        newLink: `${clientUrl}/senha/resetar`,
      },
    });
  }

  async confirmResetPassword(token: string) {
    const payload = await this.serviceTokenService.verifyTransactional(token);
    await this.userModel.findById(payload.userId).orFail();

    await this.serviceTokenService.deleteTokens(
      payload.userId,
      'TRANSACTIONAL_PASSWORD',
    );

    return token;
  }

  async putResetPassword(data: PutResetPasswordDto) {
    const payload = await this.serviceTokenService.verifyTransactional(
      data.token,
    );

    await this.userModel
      .findByIdAndUpdate(payload.userId, {
        password: await hash(data.password, 10),
      })
      .orFail();

    await this.serviceTokenService.deleteTokens(
      payload.userId,
      'TRANSACTIONAL_PASSWORD',
    );
  }
}
