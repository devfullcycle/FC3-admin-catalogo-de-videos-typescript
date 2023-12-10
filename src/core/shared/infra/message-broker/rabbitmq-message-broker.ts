import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { IMessageBroker } from '../../application/message-broker.interface';
import { IDomainEvent } from '../../domain/events/domain-event.interface';
import { EVENTS_MESSAGE_BROKER_CONFIG } from './events-message-broker-config';

export class RabbitMQMessageBroker implements IMessageBroker {
  constructor(private conn: AmqpConnection) {}

  async publishEvent(event: IDomainEvent): Promise<void> {
    const config = EVENTS_MESSAGE_BROKER_CONFIG[event.constructor.name];
    await this.conn.publish(config.exchange, config.routing_key, event);
  }
}
