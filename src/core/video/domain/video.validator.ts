import { MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Video } from './video.aggregate';
import { Notification } from '../../shared/domain/validators/notification';

export class VideoRules {
  @MaxLength(255, { groups: ['title'] })
  title: string;

  constructor(aggregate: Video) {
    Object.assign(this, aggregate);
  }
}

export class VideoValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Video,
    fields?: string[],
  ): boolean {
    const newFields = fields?.length ? fields : ['title'];
    return super.validate(notification, new VideoRules(data), newFields);
  }
}

export class VideoValidatorFactory {
  static create() {
    return new VideoValidator();
  }
}

export default VideoValidatorFactory;
