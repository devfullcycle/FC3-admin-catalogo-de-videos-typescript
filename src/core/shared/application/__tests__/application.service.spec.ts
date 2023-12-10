import EventEmitter2 from 'eventemitter2';
import { DomainEventMediator } from '../../domain/events/domain-event-mediator';
import { IUnitOfWork } from '../../domain/repository/unit-of-work.interface';
import { UnitOfWorkFakeInMemory } from '../../infra/db/in-memory/fake-unit-of-work-in-memory';
import { ApplicationService } from '../application.service';
import { AggregateRoot } from '../../domain/aggregate-root';
import { ValueObject } from '../../domain/value-object';

class StubAggregateRoot extends AggregateRoot {
  get entity_id(): ValueObject {
    throw new Error('Method not implemented.');
  }
  toJSON() {
    throw new Error('Method not implemented.');
  }
}

describe('ApplicationService Unit Tests', () => {
  let uow: IUnitOfWork;
  let domainEventMediator: DomainEventMediator;
  let applicationService: ApplicationService;

  beforeEach(() => {
    uow = new UnitOfWorkFakeInMemory();
    const eventEmitter = new EventEmitter2();
    domainEventMediator = new DomainEventMediator(eventEmitter);
    applicationService = new ApplicationService(uow, domainEventMediator);
  });

  describe('start', () => {
    it('should call the start method of unit of work', () => {
      const startSpy = jest.spyOn(uow, 'start');
      applicationService.start();
      expect(startSpy).toBeCalled();
    });
  });

  describe('finish', () => {
    it('should call the publish method of domain event mediator and the commit method', async () => {
      const aggregateRoot = new StubAggregateRoot();
      uow.addAggregateRoot(aggregateRoot);
      const publishSpy = jest.spyOn(domainEventMediator, 'publish');
      const publishIntegrationEventsSpy = jest.spyOn(
        domainEventMediator,
        'publishIntegrationEvents',
      );
      const commitSpy = jest.spyOn(uow, 'commit');
      await applicationService.finish();
      expect(publishSpy).toBeCalledWith(aggregateRoot);
      expect(commitSpy).toBeCalled();
      expect(publishIntegrationEventsSpy).toBeCalledWith(aggregateRoot);
    });
  });

  describe('fail', () => {
    it('should call the rollback method of unit of work', () => {
      const rollbackSpy = jest.spyOn(uow, 'rollback');
      applicationService.fail();
      expect(rollbackSpy).toBeCalled();
    });
  });

  describe('run', () => {
    it('should start, execute the callback, finish and return the result', async () => {
      const callback = jest.fn().mockResolvedValue('result');
      const spyStart = jest.spyOn(applicationService, 'start');
      const spyFinish = jest.spyOn(applicationService, 'finish');

      const result = await applicationService.run(callback);

      expect(spyStart).toBeCalled();
      expect(callback).toBeCalled();
      expect(spyFinish).toBeCalled();
      expect(result).toBe('result');
    });

    it('should rollback and throw the error if the callback throws an error', async () => {
      const callback = jest.fn().mockRejectedValue(new Error('test-error'));
      const spyFail = jest.spyOn(applicationService, 'fail');
      await expect(applicationService.run(callback)).rejects.toThrowError(
        'test-error',
      );
      expect(spyFail).toBeCalled();
    });
  });
});
