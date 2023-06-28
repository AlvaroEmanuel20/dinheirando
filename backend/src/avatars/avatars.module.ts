import { Module } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { AvatarsController } from './avatars.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CloudinaryModule,
  ],
  providers: [AvatarsService],
  controllers: [AvatarsController],
})
export class AvatarsModule {}
