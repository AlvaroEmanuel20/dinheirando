import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') return value;

    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) throw new BadRequestException('Invalid object id');

    return value;
  }
}
