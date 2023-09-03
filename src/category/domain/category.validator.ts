import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { Category } from "./category.entity";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";

//criar um testes que verifique os decorators
export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;

  constructor({ name, description, is_active }: Category) {
    Object.assign(this, { name, description, is_active });
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(entity: Category) {
    return super.validate(new CategoryRules(entity));
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
