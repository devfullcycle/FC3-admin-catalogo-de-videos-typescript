import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class CreateDlxQueueService implements OnModuleInit {
  constructor(private amqpConnection: AmqpConnection) {}

  async onModuleInit() {
    await this.createDlxQueue();
  }

  async createDlxQueue() {
    //criar channel separado para criar a fila mais rapidamente, já que o amqp-connection-manager pode demorar para criar o channel
    //aí iria atrasar o boot da aplicação
    const channelWrapper =
      this.amqpConnection.managedConnection.createChannel();
    await channelWrapper.addSetup((channel) => {
      return Promise.all([
        channel.assertExchange('dlx.exchange', 'topic'),
        channel.assertQueue('dlx.queue'),
        channel.bindQueue('dlx.queue', 'dlx.exchange', '#'),
      ]);
    });
    await channelWrapper.close();
  }
}
