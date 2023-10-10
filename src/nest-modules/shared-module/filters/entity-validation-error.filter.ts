import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { union } from 'lodash';
import { EntityValidationError } from '../../../core/shared/domain/validators/validation.error';

@Catch(EntityValidationError)
export class EntityValidationErrorFilter implements ExceptionFilter {
  catch(exception: EntityValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(422).json({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: union(
        ...exception.error.reduce(
          (acc, error) =>
            acc.concat(
              typeof error === 'string' ? [[error]] : Object.values(error),
            ),
          [],
        ),
      ),
    });
  }
}
