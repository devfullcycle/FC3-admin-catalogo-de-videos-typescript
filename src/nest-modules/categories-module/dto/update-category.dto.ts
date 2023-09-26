import { OmitType } from '@nestjs/mapped-types';
import { UpdateCategoryInput } from '../../../core/category/application/use-cases/update-category/update-category.input';

export class UpdateCategoryInputWithoutId extends OmitType(
  UpdateCategoryInput,
  ['id'] as const,
) {}

export class UpdateCategoryDto extends UpdateCategoryInputWithoutId {}
