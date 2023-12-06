import EventEmitter2 from 'eventemitter2';
import { AggregateRoot } from '../aggregate-root';

export class DomainEventMediator {
  constructor(private eventEmitter: EventEmitter2) {}

  register(event: string, handler: any) {
    this.eventEmitter.on(event, handler);
  }

  async publish(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.events) {
      const eventClassName = event.constructor.name;
      await this.eventEmitter.emitAsync(eventClassName, event);
    }
  }
}
