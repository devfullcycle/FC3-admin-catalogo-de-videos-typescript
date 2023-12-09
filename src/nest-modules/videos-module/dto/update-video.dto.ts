import { OmitType } from '@nestjs/mapped-types';
import { UpdateVideoInput } from '../../../core/video/application/use-cases/update-video/update-video.input';

export class UpdateVideoInputWithoutId extends OmitType(UpdateVideoInput, [
  'id',
] as any) {}

export class UpdateVideoDto extends UpdateVideoInputWithoutId {}
