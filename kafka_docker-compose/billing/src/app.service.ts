import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from './order-created.event';
import { GetUserRequest } from './get-user-request.dto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  onModuleInit() {
    this.authClient.subscribeToResponseOf('get_user');
  }

  handleOrderCreated(orderCreatedEvent: OrderCreatedEvent) {
    this.authClient
      .send('get_user', new GetUserRequest(orderCreatedEvent.userId))
      .subscribe((user) => {
        if (typeof user === 'object') {
          console.log(
            `Billing user with stripe ID ${user.stripeUserId} for a price of ${orderCreatedEvent.price}...`,
          );
        } else {
          console.log(
            'wrong userId of ' + orderCreatedEvent.userId + ' was passed',
          );
        }
      }
      );
  }
}
