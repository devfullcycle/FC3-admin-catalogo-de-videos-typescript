import { VideoAudioMediaReplaced } from '../../../video/domain/domain-events/video-audio-media-replaced.event';

export const EVENTS_MESSAGE_BROKER_CONFIG = {
  [VideoAudioMediaReplaced.name]: {
    exchange: 'amq.direct',
    routing_key: VideoAudioMediaReplaced.name,
  },
  TestEvent: {
    exchange: 'test-exchange',
    routing_key: 'TestEvent',
  },
};
