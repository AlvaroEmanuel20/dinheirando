import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { MailService } from 'src/mail/mail.service';
import { hash } from 'bcryptjs';
import { TransactionalTokensService } from 'src/transactionalTokens/transactionalTokens.service';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from 'src/auth/schemas/refreshToken.schema';
import { TransactionalToken } from 'src/transactionalTokens/schemas/transactionalToken.schema';
import { Category } from 'src/categories/schemas/category.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly User: Model<User>,
    @InjectModel(RefreshToken.name)
    private readonly RefreshToken: Model<RefreshToken>,
    @InjectModel(TransactionalToken.name)
    private readonly TransactionalToken: Model<TransactionalToken>,
    @InjectModel(Category.name)
    private readonly Category: Model<Category>,
    private readonly mailService: MailService,
    private readonly transactionalTokenService: TransactionalTokensService,
    private readonly configService: ConfigService,
  ) {}

  async showUser(userId: string) {
    return await this.User.findById(userId).select('-password');
  }

  async showUserByEmail(email: string) {
    return await this.User.findOne({ email });
  }

  async createUser(data: CreateUserDto) {
    data.password = await hash(data.password, 10);
    const newUser = await this.User.create(data);

    if (!data.isVerified)
      await this.sendConfirmEmail(newUser.id, data.email, data.name);

    return { userId: newUser._id };
  }

  async validateUserAccount(token: string) {
    const storedEmailToken = await this.TransactionalToken.findOne({
      token,
    });

    if (!storedEmailToken) throw new Error('Blocked email token');

    const payload = await this.transactionalTokenService.verify(token);
    if (payload) {
      await this.User.findByIdAndUpdate(payload.userId, {
        isVerified: true,
      }).orFail();
    }

    await this.TransactionalToken.deleteOne({ token });
  }

  async newConfirmEmail(userId: string) {
    const user = await this.User.findById(userId).orFail();
    await this.sendConfirmEmail(userId, user.email, user.name);
  }

  async updateUser(data: UpdateUserDto, userId: string) {
    if (data.password) data.password = await hash(data.password, 10);
    const user = await this.User.findByIdAndUpdate(userId, data).orFail();

    if (data.email && user.email !== data.email) {
      await this.User.findByIdAndUpdate(userId, {
        isVerified: false,
      });

      await this.sendConfirmEmail(userId, data.email, data.name);
    }

    return { userId };
  }

  async deleteUser(userId: string) {
    await this.Category.deleteMany({ user: userId });
    await this.TransactionalToken.deleteMany({ user: userId });
    await this.RefreshToken.deleteOne({ user: userId });
    await this.User.findByIdAndDelete(userId).orFail();
    return { userId };
  }

  private async sendConfirmEmail(userId: string, email: string, name: string) {
    await this.TransactionalToken.deleteOne({
      user: userId,
      scope: 'EMAIL',
    });

    const token = await this.transactionalTokenService.create(userId, 'EMAIL');

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
