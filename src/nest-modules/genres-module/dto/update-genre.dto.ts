import { OmitType } from '@nestjs/mapped-types';
import { UpdateGenreInput } from '../../../core/genre/application/use-cases/update-genre/update-genre.input';

export class UpdateGenreInputWithoutId extends OmitType(UpdateGenreInput, [
  'id',
] as any) {}

export class UpdateGenreDto extends UpdateGenreInputWithoutId {}
