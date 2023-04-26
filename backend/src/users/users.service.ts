import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { MailService } from 'src/mail/mail.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
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

    await this.mailService.sendMail({
      to: data.email,
      subject: 'Dinheirando - Confirme seu email',
      html: '<h1>Testando</h1>',
    });

    return { userId: newUser._id };
  }

  async updateUser(data: UpdateUserDto, userId: string) {
    if (data.password) data.password = await hash(data.password, 10);
    await this.userModel.findByIdAndUpdate(userId, data).orFail();

    if (data.email) {
      await this.userModel.findByIdAndUpdate(userId, {
        isVerified: false,
      });

      await this.mailService.sendMail({
        to: data.email,
        subject: 'Dinheirando - Confirme seu novo email',
        html: '<h1>Testando</h1>',
      });
    }

    return { userId };
  }

  async deleteUser(userId: string) {
    await this.userModel.findByIdAndDelete(userId).orFail();
    return { userId };
  }
}
