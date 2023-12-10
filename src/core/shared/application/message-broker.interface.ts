import { IIntegrationEvent } from '../domain/events/domain-event.interface';

export interface IMessageBroker {
  publishEvent(event: IIntegrationEvent): Promise<void>;
}
