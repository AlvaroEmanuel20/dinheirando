import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(image: Express.Multer.File, userId: string) {
    return new Promise<UploadApiResponse | UploadApiErrorResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: this.configService.get<string>('CLOUDINARY_FOLDER'),
            public_id: `${userId}-${Date.now()}-avatar`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(image.buffer).pipe(uploadStream);
      }
    );
  }

  async getImageUrl(imagePublicId: string) {
    const result = await cloudinary.api.resource(imagePublicId);
    return cloudinary.url(result.public_id);
  }

  async deleteImage(imagePublicId: string) {
    return await cloudinary.uploader.destroy(imagePublicId);
  }
}
