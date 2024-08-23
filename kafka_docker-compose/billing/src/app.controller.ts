import {
  Controller,
  Get,
  OnModuleInit,
  Inject,
  UseFilters,
} from '@nestjs/common';
import {
  EventPattern,
  ClientKafka,
  Ctx,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { KafkaExceptionFilter } from '../exceptionFilter/KafkaExceptioFilter';
import { log } from 'console';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('order_created')
  @UseFilters(KafkaExceptionFilter)
  handleOrderCreated(@Payload() data: any, @Ctx() context: KafkaContext) {
    console.log('getMessage', context.getMessage());

    this.appService.handleOrderCreated(data);
  }
}
