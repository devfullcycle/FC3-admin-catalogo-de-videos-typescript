import { OnEvent } from '@nestjs/event-emitter';
import { IIntegrationEventHandler } from '../../../shared/application/domain-event-handler.interface';
import { VideoAudioMediaUploadedIntegrationEvent } from '../../domain/domain-events/video-audio-media-replaced.event';
import { IMessageBroker } from '../../../shared/application/message-broker.interface';

export class PublishVideoMediaReplacedInQueueHandler
  implements IIntegrationEventHandler
{
  constructor(private messageBroker: IMessageBroker) {
   // console.log(messageBroker);
  }

  @OnEvent(VideoAudioMediaUploadedIntegrationEvent.name)
  async handle(event: VideoAudioMediaUploadedIntegrationEvent): Promise<void> {
    await this.messageBroker.publishEvent(event);
  }
}
