import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsIn,
  validateSync,
  MaxLength,
} from 'class-validator';
import { AudioVideoMediaStatus } from '../../../../shared/domain/value-objects/audio-video-media.vo';

export type ProcessAudioVideoMediasInputConstructorProps = {
  video_id: string;
  encoded_location: string;
  field: 'trailer' | 'video';
  status: AudioVideoMediaStatus;
};

export class ProcessAudioVideoMediasInput {
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  video_id: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  encoded_location: string;

  @IsIn(['trailer', 'video'])
  @IsNotEmpty()
  field: 'trailer' | 'video';

  @IsIn([AudioVideoMediaStatus.COMPLETED, AudioVideoMediaStatus.FAILED])
  @IsNotEmpty()
  status: AudioVideoMediaStatus;

  constructor(props?: ProcessAudioVideoMediasInputConstructorProps) {
    if (!props) return;
    this.video_id = props.video_id;
    this.encoded_location = props.encoded_location;
    this.field = props.field;
    this.status = props.status;
  }
}

export class ValidateProcessAudioVideoMediasInput {
  static validate(input: ProcessAudioVideoMediasInput) {
    return validateSync(input);
  }
}
