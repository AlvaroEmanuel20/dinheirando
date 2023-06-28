import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ImageTypeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    const validValues = ['image/jpg', 'image/jpeg', 'image/png'];
    return validValues.includes(value.mimetype);
  }
}
