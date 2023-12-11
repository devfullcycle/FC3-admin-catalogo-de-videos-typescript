import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NotFoundError } from '../../../core/shared/domain/errors/not-found.error';
import { EntityValidationError } from '../../../core/shared/domain/validators/validation.error';
import { Nack } from '@golevelup/nestjs-rabbitmq';

@Catch()
export class RabbitmqConsumeErrorFilter implements ExceptionFilter {
  static readonly NON_RETRIABLE_ERRORS = [
    NotFoundError,
    EntityValidationError,
    UnprocessableEntityException,
  ];

  catch(exception: Error, host: ArgumentsHost) {
    if (host.getType<'rmq'>() !== 'rmq') {
      return;
    }

    const hasRetriableError =
      RabbitmqConsumeErrorFilter.NON_RETRIABLE_ERRORS.some(
        (error) => exception instanceof error,
      );

    if (hasRetriableError) {
      return new Nack(false);
    }
  }
}

//http rabbitmq
