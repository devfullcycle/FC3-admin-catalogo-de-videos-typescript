import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { IMessageBroker } from '../../application/message-broker.interface';
import { IIntegrationEvent } from '../../domain/events/domain-event.interface';
import { EVENTS_MESSAGE_BROKER_CONFIG } from './events-message-broker-config';

export class RabbitMQMessageBroker implements IMessageBroker {
  constructor(private conn: AmqpConnection) {}

  async publishEvent(event: IIntegrationEvent): Promise<void> {
    const config = EVENTS_MESSAGE_BROKER_CONFIG[event.constructor.name];
    await this.conn.publish(config.exchange, config.routing_key, event);
  }
}
