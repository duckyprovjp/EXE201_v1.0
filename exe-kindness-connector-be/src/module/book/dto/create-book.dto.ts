import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Condition } from '../../../common/enums/condition.enum';
import { Book_Status } from '../../../common/enums/status.enum';

class AddressDto {
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  ward?: string;

  @IsString()
  @IsOptional()
  street?: string;
}

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;

  @IsArray()
  @IsOptional()
  categories?: string[];

  @IsArray()
  @IsOptional()
  advancedCategories?: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsEnum(Condition)
  @IsOptional()
  codition?: Condition;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  location?: AddressDto;

  @IsOptional()
  owner?: any;

  @IsEnum(Book_Status)
  @IsOptional()
  status?: Book_Status;

  @IsOptional()
  viewCount?: number;
}
