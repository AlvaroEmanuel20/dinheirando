import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: 'income' | 'expense';

  @ApiProperty()
  totalOfTransactions: number;
}

export class CategoryIdDto {
  @ApiProperty()
  categoryId: string;
}

export class CreateCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: 'income' | 'expense';
}

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  type: 'income' | 'expense';

  @ApiPropertyOptional()
  totalOfTransactions: number;
}
