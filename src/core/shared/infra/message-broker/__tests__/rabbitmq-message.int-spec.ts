import { RabbitMQMessageBroker } from '../rabbitmq-message-broker';
import { IIntegrationEvent } from '../../../domain/events/domain-event.interface';
import { Uuid } from '../../../domain/value-objects/uuid.vo';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Config } from '../../config';
import { ConsumeMessage } from 'amqplib';

class TestEvent implements IIntegrationEvent {
  occurred_on: Date = new Date();
  event_version: number = 1;
  event_name: string = TestEvent.name;
  constructor(readonly payload: any) {}
}

describe('RabbitMQMessageBroker Integration tests', () => {
  let service: RabbitMQMessageBroker;
  let connection: AmqpConnection;
  beforeEach(async () => {
    connection = new AmqpConnection({
      uri: Config.rabbitmqUri(),
      connectionInitOptions: { wait: true },
      logger: {
        debug: () => {},
        error: () => {},
        info: () => {},
        warn: () => {},
        log: () => {},
      } as any,
    });

    await connection.init();
    const channel = connection.channel;

    await channel.assertExchange('test-exchange', 'direct', {
      durable: false,
    });
    await channel.assertQueue('test-queue', { durable: false });
    await channel.purgeQueue('test-queue');
    await channel.bindQueue('test-queue', 'test-exchange', 'TestEvent');
    service = new RabbitMQMessageBroker(connection);
  });

  afterEach(async () => {
    try {
      await connection.managedConnection.close();
    } catch (err) {}
  });

  describe('publish', () => {
    it('should publish events to channel', async () => {
      const event = new TestEvent(new Uuid());

      await service.publishEvent(event);
      const msg: ConsumeMessage = await new Promise((resolve) => {
        connection.channel.consume('test-queue', (msg) => {
          resolve(msg as any);
        });
      });
      const msgObj = JSON.parse(msg.content.toString());
      expect(msgObj).toEqual({
        event_name: TestEvent.name,
        event_version: 1,
        occurred_on: event.occurred_on.toISOString(),
        payload: event.payload,
      });
    });
  });
});
