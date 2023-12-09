import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsIn,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { FileMediaInput } from '../common/file-media.input';

export type UploadAudioVideoMediaInputConstructorProps = {
  video_id: string;
  field: 'trailer' | 'video';
  file: FileMediaInput;
};

export class UploadAudioVideoMediaInput {
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  video_id: string;

  @IsIn(['trailer', 'video'])
  @IsNotEmpty()
  field: 'trailer' | 'video';

  @ValidateNested()
  file: FileMediaInput;

  constructor(props?: UploadAudioVideoMediaInputConstructorProps) {
    if (!props) return;
    this.video_id = props.video_id;
    this.field = props.field;
    this.file = props.file;
  }
}

export class ValidateUploadVideoMediaInput {
  static validate(input: UploadAudioVideoMediaInput) {
    return validateSync(input);
  }
}
