import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const restartOnKafkaConnectionError = async (err: Error): Promise<boolean> => {
  console.log(err.name);
  return true;
};

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BILLING_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'billing',
            brokers: ['pkc-qz0g6.eu-central-1.aws.confluent.cloud:9092'],
            ssl: true,
            sasl: {
              mechanism: 'plain',
              username: '5ZKWE3MIHO2MVTXH',
              password:
                'qNz8hxdDLYPv+TGTv9EQO+m/vPZ3JbyQSfhbsPsYnhx7SZ2RbGq1JddhgYV+MW/1',
            },
            logLevel: 5,
          },
          consumer: {
            groupId: 'billing-consumer',
            // retry: {
            //   restartOnFailure: restartOnKafkaConnectionError,
            // },
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
