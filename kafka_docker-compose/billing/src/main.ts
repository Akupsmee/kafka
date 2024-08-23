import { NestFactory } from '@nestjs/core';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

import { Logger, PinoLogger } from 'nestjs-pino';
import {
  KafkaJSConnectionError,
  KafkaJSNonRetriableError,
  KafkaJSNumberOfRetriesExceeded,
} from 'kafkajs';

const restartOnKafkaConnectionError = async (err: Error): Promise<boolean> => {
  const kafkaRetryLogger: Logger = new Logger(
    new PinoLogger({
      pinoHttp: {
        redact: {
          paths: [],
          censor: '*** REDACTED ***',
        },
        base: { service: 'api-gateway' },
      },
    }),
    { renameContext: 'context' },
  );
  if (
    err instanceof KafkaJSNonRetriableError === false &&
    err instanceof KafkaJSNumberOfRetriesExceeded === false
  ) {
    kafkaRetryLogger.log(
      {
        context: err.name,
        message: err.message,
      },
      'Retriable error: restarting consumer',
    );
    return true;
  }
  kafkaRetryLogger.log(
    {
      context: err.name,
      message: err.message,
    },
    'Non Retriable error',
  );
  return false;
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice<KafkaOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'billing-consumer',
        // retry: {
        //   restartOnFailure: restartOnKafkaConnectionError,
        // },
      },
      subscribe: {},
    },
  });
  await app.listen();
}
bootstrap();
