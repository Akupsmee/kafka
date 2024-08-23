// Even though a message is received from Kafka, it might not be handled for a variety of reasons (such as when a database is down or a webhook is unavailable). Kafka still counts the message as processed even if it didn't work.  We could automatically indicate that the message needs to be retried by throwing an Error or RpcException.

import {
  ArgumentsHost,
  Catch,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Catch(RpcException)
export class KafkaExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(KafkaExceptionFilter.name);
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    this.logger.log({ kafkaExceptionFilter: exception });
    throw exception.getError();
  }
}
