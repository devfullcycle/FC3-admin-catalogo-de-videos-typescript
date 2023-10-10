import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityValidationErrorFilter } from './entity-validation-error.filter';
import request from 'supertest';
import { EntityValidationError } from '../../../core/shared/domain/validators/validation.error';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new EntityValidationError([
      'another error',
      {
        field1: ['field1 is required', 'error 2'],
      },
      {
        field2: ['field2 is required'],
      },
    ]);
  }
}

describe('EntityValidationErrorFilter Unit Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new EntityValidationErrorFilter());
    await app.init();
  });

  it('should catch a EntityValidationError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(422)
      .expect({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: [
          'another error',
          'field1 is required',
          'error 2',
          'field2 is required',
        ],
      });
  });
});
