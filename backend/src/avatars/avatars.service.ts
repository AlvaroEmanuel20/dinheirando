import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AvatarsService {
  constructor(
    @InjectModel(User.name) private readonly User: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadAvatar(image: Express.Multer.File, userId: string) {
    const user = await this.User.findById(userId);
    await this.cloudinaryService.deleteImage(user.avatar);

    const result = await this.cloudinaryService.uploadImage(image, userId);
    const avatarUrl = await this.cloudinaryService.getImageUrl(
      result.public_id,
    );

    await this.User.updateOne(
      { _id: userId },
      {
        avatar: result.public_id,
        avatarUrl,
      },
    );

    return { imageId: result.public_id, uploaded: true };
  }

  async getAvatarUrl(userId: string) {
    const user = await this.User.findById(userId);
    return await this.cloudinaryService.getImageUrl(user.avatar);
  }
}
