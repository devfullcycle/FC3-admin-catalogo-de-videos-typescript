import { AggregateRoot } from '../../../domain/aggregate-root';
import { IUnitOfWork } from '../../../domain/repository/unit-of-work.interface';

export class UnitOfWorkFakeInMemory implements IUnitOfWork {
  private aggregateRoots: Set<AggregateRoot> = new Set<AggregateRoot>();

  constructor() {}

  async start(): Promise<void> {
    return;
  }

  async commit(): Promise<void> {
    return;
  }

  async rollback(): Promise<void> {
    return;
  }

  do<T>(workFn: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    return workFn(this);
  }

  getTransaction() {
    return;
  }

  addAggregateRoot(aggregateRoot: AggregateRoot): void {
    this.aggregateRoots.add(aggregateRoot);
  }
  getAggregateRoots(): AggregateRoot[] {
    return [...this.aggregateRoots];
  }
}
