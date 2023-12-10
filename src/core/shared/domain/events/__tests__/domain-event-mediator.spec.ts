import EventEmitter2 from 'eventemitter2';
import { AggregateRoot } from '../../aggregate-root';
import { ValueObject } from '../../value-object';
import { Uuid } from '../../value-objects/uuid.vo';
import { DomainEventMediator } from '../domain-event-mediator';
import { IDomainEvent, IIntegrationEvent } from '../domain-event.interface';

class StubEvent implements IDomainEvent {
  occurred_on: Date;
  event_version: number;
  constructor(
    public aggregate_id: Uuid,
    public name: string,
  ) {
    this.occurred_on = new Date();
    this.event_version = 1;
  }

  getIntegrationEvent(): StubIntegrationEvent {
    return new StubIntegrationEvent(this);
  }
}

class StubIntegrationEvent implements IIntegrationEvent {
  occurred_on: Date;
  event_version: number;
  payload: any;
  event_name: string;
  constructor(event: StubEvent) {
    this.occurred_on = event.occurred_on;
    this.event_version = event.event_version;
    this.payload = event;
    this.event_name = this.constructor.name;
  }
}

class StubAggregate extends AggregateRoot {
  id: Uuid;
  name: string;

  get entity_id(): ValueObject {
    return this.id;
  }

  action(name) {
    this.name = name;
    this.applyEvent(new StubEvent(this.id, this.name));
  }

  toJSON() {
    return {
      id: this.id.toString(),
      name: this.name,
    };
  }
}

describe('DomainEventMediator Unit Tests', () => {
  let mediator: DomainEventMediator;

  beforeEach(() => {
    const eventEmitter = new EventEmitter2();
    mediator = new DomainEventMediator(eventEmitter);
  });

  it('should publish handler', async () => {
    expect.assertions(1);
    mediator.register(StubEvent.name, async (event: StubEvent) => {
      expect(event.name).toBe('test');
    });

    const aggregate = new StubAggregate();
    aggregate.action('test');
    await mediator.publish(aggregate);
    await mediator.publish(aggregate);
  });

  it('should not publish an integration event', () => {
    expect.assertions(1);
    const spyEmitAsync = jest.spyOn(mediator['eventEmitter'], 'emitAsync');

    const aggregate = new StubAggregate();
    aggregate.action('test');
    Array.from(aggregate.events)[0].getIntegrationEvent = undefined;
    mediator.publishIntegrationEvents(aggregate);
    expect(spyEmitAsync).not.toBeCalled();
  });

  it('should publish integration event', async () => {
    expect.assertions(4);
    mediator.register(
      StubIntegrationEvent.name,
      async (event: StubIntegrationEvent) => {
        expect(event.event_name).toBe(StubIntegrationEvent.name);
        expect(event.event_version).toBe(1);
        expect(event.occurred_on).toBeInstanceOf(Date);
        expect(event.payload.name).toBe('test');
      },
    );

    const aggregate = new StubAggregate();
    aggregate.action('test');
    await mediator.publishIntegrationEvents(aggregate);
  });
});
