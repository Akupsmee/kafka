import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateOrderRequest } from './create-order-request.dto';
import { OrderCreatedEvent } from './order-created.event';

const {
  SchemaRegistry,
  SchemaType,
} = require('@kafkajs/confluent-schema-registry');

const registry = new SchemaRegistry({
  host: 'https://psrc-95km5.eu-central-1.aws.confluent.cloud',
  auth: {
    username: '6SYG6T2IPDQX5UMI',
    password:
      'ZKLL5Uqd7vU3sN+cVJ8ZlXF6YoQrqNtrDwTzSrp5zOZPodb2vsTEyrFgKZdFQam7',
  },
});

const payload = {
  eventId: 'fd238e9f-fe32-42dc-bd74-c66bec035d39',
  inquiryId: '4886a464-16a1-4d09-92cf-8abda6e52192',
  sanitizedSubject: 'Project title II',
  sanitizedDescription: 'Project description II',
  country: 'de',
  metadata: {
    eventSemver: '1.0.0',
    eventTime: Date.now(),
    eventSource: 'new-srt-inquiry-command',
    operation: 'CREATE',
  },
};

@Injectable()
export class AppService {
  constructor(
    @Inject('BILLING_SERVICE') private readonly billingClient: ClientKafka,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async createOrder({ userId, price }: CreateOrderRequest) {
    // Upload a schema to the registry
    const schema = `{
    "type": "record",
    "name": "InquiryCreated",
    "namespace": "com.obi.salesrep.inquiry.sanitized.v1",
    "fields": [
      {
        "name": "eventId",
        "type": "string"
      },
      {
        "name": "inquiryId",
        "type": "string"
      },
      {
        "name": "sanitizedSubject",
        "type": [
          "string",
          "null"
        ]
      },
      {
        "name": "sanitizedDescription",
        "type": [
          "string",
          "null"
        ]
      },
      {
        "name": "country",
        "type": {
          "type": "enum",
          "name": "CountryId",
          "doc": "The two letter id of a given country",
          "symbols": [
            "de",
            "at"
          ]
        }
      },
      {
        "name": "metadata",
        "type": {
          "type": "record",
          "name": "metadata",
          "fields": [
            {
              "name": "eventSemver",
              "type": "string"
            },
            {
              "name": "eventTime",
              "type": {
                "type": "long",
                "logicalType": "timestamp-millis"
              }
            },
            {
              "name": "eventSource",
              "type": "string"
            },
            {
              "name": "operation",
              "type": {
                "type": "enum",
                "name": "OperationType",
                "doc": "The type of an operation.",
                "symbols": [
                  "CREATE",
                  "UPDATE",
                  "DELETE"
                ]
              }
            }
          ]
        }
      }
    ]
    }
`;

    const { id } = await registry.register({ type: SchemaType.AVRO, schema });

    const encoded = await registry.encode(id, payload);

    try {
      this.billingClient.emit(
        'srt-da-devtest.konsys-inquiry-sanitized-avro-papi.inquiry-sanitized.c.v1',
        encoded,
      );
      console.log({ userId, price });
    } catch (error) {
      console.log(error);
    }
  }
}
