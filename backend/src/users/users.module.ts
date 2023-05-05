import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MailModule } from 'src/mail/mail.module';
import { TransactionalTokensModule } from 'src/transactionalTokens/transactionalTokens.module';
import { ConfigModule } from '@nestjs/config';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
    TransactionalTokensModule,
    ConfigModule,
  ],
  controllers: [UsersController, PasswordController],
  providers: [UsersService, PasswordService],
  exports: [UsersService],
})
export class UsersModule {}
