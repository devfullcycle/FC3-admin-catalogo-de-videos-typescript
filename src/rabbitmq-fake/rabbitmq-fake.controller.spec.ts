import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqFakeController } from './rabbitmq-fake.controller';

describe('RabbitmqFakeController', () => {
  let controller: RabbitmqFakeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RabbitmqFakeController],
    }).compile();

    controller = module.get<RabbitmqFakeController>(RabbitmqFakeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
