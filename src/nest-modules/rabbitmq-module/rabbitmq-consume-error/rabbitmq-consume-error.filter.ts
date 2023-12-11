import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class RabbitmqConsumeErrorFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    if (host.getType<'rmq'>() !== 'rmq') {
      return;
    }

    //console.log(exception);
    console.log('aaaaaaa');
  }
}

//http rabbitmq
