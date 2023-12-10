import { IMessageBroker } from '../../application/message-broker.interface';
import { IIntegrationEvent } from '../../domain/events/domain-event.interface';

export class InMemoryMessaging implements IMessageBroker {
  private handlers: {
    [key: string]: (event: IIntegrationEvent) => Promise<void>;
  } = {};

  async publishEvent(event: IIntegrationEvent) {
    const handler = this.handlers[event.constructor.name];
    if (handler) {
      await handler(event);
    }
  }

  //   public subscribe<T extends IIntegrationEvent>(
  //     event: { new (...args: any[]): T },
  //     handler: (event: T) => void,
  //   ): void {
  //     this.handlers[event.name] = handler;
  //   }

  //   public unsubscribe<T extends IIntegrationEvent>(event: {
  //     new (...args: any[]): T;
  //   }): void {
  //     delete this.handlers[event.name];
  //   }
}
