import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { MailService } from 'src/mail/mail.service';
import { hash } from 'bcryptjs';
import { ServiceTokensService } from 'src/serviceTokens/serviceTokens.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailService: MailService,
    private readonly serviceTokenService: ServiceTokensService,
    private readonly configService: ConfigService,
  ) {}

  async showUser(userId: string) {
    return await this.userModel.findById(userId).select('-password');
  }

  async showUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async createUser(data: CreateUserDto) {
    data.password = await hash(data.password, 10);
    const newUser = await this.userModel.create(data);

    if (!data.isVerified)
      await this.sendConfirmEmail(newUser.id, data.email, data.name);

    return { userId: newUser._id };
  }

  async validateUserAccount(token: string) {
    const payload = await this.serviceTokenService.verifyTransactional(token);
    await this.userModel
      .findByIdAndUpdate(payload.userId, { isVerified: true })
      .orFail();

    await this.serviceTokenService.deleteTokens(
      payload.userId,
      'TRANSACTIONAL_EMAIL',
    );
  }

  async newConfirmEmail(userId: string) {
    const user = await this.userModel.findById(userId).orFail();
    await this.sendConfirmEmail(userId, user.email, user.name);
  }

  async updateUser(data: UpdateUserDto, userId: string) {
    if (data.password) data.password = await hash(data.password, 10);
    await this.userModel.findByIdAndUpdate(userId, data).orFail();

    if (data.email) {
      await this.userModel.findByIdAndUpdate(userId, {
        isVerified: false,
      });

      await this.sendConfirmEmail(userId, data.email, data.name);
    }

    return { userId };
  }

  async deleteUser(userId: string) {
    await this.serviceTokenService.deleteTokens(userId, 'REFRESH');
    await this.serviceTokenService.deleteTokens(userId, 'TRANSACTIONAL_EMAIL');
    await this.serviceTokenService.deleteTokens(
      userId,
      'TRANSACTIONAL_PASSWORD',
    );

    await this.userModel.findByIdAndDelete(userId).orFail();
    return { userId };
  }

  private async sendConfirmEmail(userId: string, email: string, name: string) {
    await this.serviceTokenService.deleteTokens(userId, 'TRANSACTIONAL_EMAIL');
    const token = await this.serviceTokenService.createTransactional(
      userId,
      'TRANSACTIONAL_EMAIL',
    );

    const serverUrl = this.configService.get<string>('SERVER_URL');
    await this.mailService.sendMail({
      to: email,
      templateId: this.configService.get<number>('CONFIRM_ACCOUNT_TEMPLATE_ID'),
      params: {
        name: name,
        confirmLink: `${serverUrl}/users/confirm?token=${token}`,
      },
    });
  }
}
