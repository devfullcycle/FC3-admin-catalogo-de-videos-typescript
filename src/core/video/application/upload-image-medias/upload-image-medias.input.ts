import {
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { FileMediaInput } from '../common/file-media.input';

export type UploadImageMediasInputConstructorProps = {
  video_id: string;
  field: string; //banner, thumbnail, thumbnail_half
  file: FileMediaInput;
};

export class UploadImageMediasInput {
  //@IsUUID('4', { each: true })
  @IsString()
  @IsNotEmpty()
  video_id: string;

  @IsIn(['banner', 'thumbnail', 'thumbnail_half'])
  @IsNotEmpty()
  field: 'banner' | 'thumbnail' | 'thumbnail_half'; //banner, thumbnail, thumbnail_half

  @ValidateNested()
  file: FileMediaInput;

  constructor(props: UploadImageMediasInput) {
    if (!props) return;

    this.video_id = props.video_id;
    this.field = props.field;
    this.file = props.file;
  }
}

export class ValidateUploadImageMediasInput {
  static validate(input: UploadImageMediasInput) {
    return validateSync(input);
  }
}
