import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit, UseFilters } from '@nestjs/common';
import { RabbitmqConsumeErrorFilter } from './rabbitmq-consume-error.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqModule } from '../rabbitmq.module';
import { EntityValidationError } from '../../../core/shared/domain/validators/validation.error';
import { ConfigModule } from '../../config-module/config.module';

const queue1 = 'test-retry-1';
const queue2 = 'test-retry-2';
const queue3 = 'test-retry-3';

@UseFilters(RabbitmqConsumeErrorFilter)
@Injectable()
class StubConsumer {
  @RabbitSubscribe({
    exchange: 'direct.delayed',
    routingKey: queue1,
    queue: queue1,
    allowNonJsonMessages: true,
    queueOptions: {
      durable: false,
    },
  })
  handle1() {
    this.throwError();
  }

  @RabbitSubscribe({
    exchange: 'direct.delayed',
    routingKey: queue2,
    queue: queue2,
    allowNonJsonMessages: true,
    queueOptions: {
      durable: false,
    },
  })
  handle2() {
    this.throwError();
  }

  @RabbitSubscribe({
    exchange: 'direct.delayed',
    routingKey: queue3,
    queue: queue3,
    allowNonJsonMessages: true,
    queueOptions: {
      durable: false,
    },
  })
  handle3() {
    this.throwError();
  }

  throwError() {}
}

@Injectable()
export class PurgeRetryQueue implements OnModuleInit {
  constructor(private amqpConnection: AmqpConnection) {}

  async onModuleInit() {
    await this.purgeRetryQueue();
  }

  async purgeRetryQueue() {
    const channelWrapper =
      this.amqpConnection.managedConnection.createChannel();
    await channelWrapper.addSetup((channel) => {
      return Promise.all([
        channel.purgeQueue(queue1),
        channel.purgeQueue(queue2),
        channel.purgeQueue(queue3),
      ]);
    });
    await channelWrapper.close();
  }
}

class FakeError extends Error {}

describe('RabbitmqConsumeErrorFilter Integration Tests', () => {
  let filter: RabbitmqConsumeErrorFilter;
  let module: TestingModule;
  let consumer: StubConsumer;
  let amqpConnection: AmqpConnection;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        RabbitmqModule.forRoot({ enableConsumers: true }),
      ],
      providers: [RabbitmqConsumeErrorFilter, StubConsumer, PurgeRetryQueue],
    }).compile();

    await module.init();

    filter = module.get<RabbitmqConsumeErrorFilter>(RabbitmqConsumeErrorFilter);
    consumer = module.get<StubConsumer>(StubConsumer);
    amqpConnection = module.get<AmqpConnection>(AmqpConnection);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should not retry if error is non-retriable', async () => {
    const spyThrowError = jest
      .spyOn(consumer, 'throwError')
      .mockImplementation(() => {
        throw new EntityValidationError([]);
      });
    const spyHandleMessage = jest.spyOn(amqpConnection, 'handleMessage' as any);
    const spyRetry = jest.spyOn(filter as any, 'retry');
    await amqpConnection.publish('direct.delayed', queue1, 'test');

    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(spyHandleMessage.mock.results[0].value).resolves.toEqual({
      _requeue: false,
    });
    expect(spyRetry).not.toHaveBeenCalled();
    expect(spyThrowError).toHaveBeenCalled();
  });

  it('should retry if error is retriable and retry count is less than max retries', async () => {
    const spyThrowError = jest
      .spyOn(consumer, 'throwError')
      .mockImplementation(() => {
        throw new FakeError();
      });
    const spyPublish = jest.spyOn(amqpConnection, 'publish' as any);
    await amqpConnection.publish('direct.delayed', queue2, 'test');

    //sleep
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(spyThrowError).toHaveBeenCalled();
    expect(spyPublish).toHaveBeenCalledWith(
      'direct.delayed',
      queue2,
      Buffer.from(JSON.stringify('test')),
      {
        correlationId: undefined,
        headers: {
          'x-retry-count': 1,
          'x-delay': 5000,
        },
      },
    );
  });

  it('should not retry if error is retriable and retry count is greater than max retries', async () => {
    const spyThrowError = jest
      .spyOn(consumer, 'throwError')
      .mockImplementation(() => {
        throw new FakeError();
      });
    const ampqConnection: AmqpConnection = module.get(AmqpConnection);
    const spyHandleMessage = jest.spyOn(ampqConnection, 'handleMessage' as any);
    const spyRetry = jest.spyOn(filter as any, 'retry');
    await ampqConnection.publish('direct.delayed', queue3, 'test', {
      headers: {
        'x-retry-count': 3,
      },
    });

    //sleep
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(spyThrowError).toHaveBeenCalled();
    expect(spyRetry).not.toHaveBeenCalled();
    expect(spyHandleMessage.mock.results[0].value).resolves.toEqual({
      _requeue: false,
    });
  });
});
