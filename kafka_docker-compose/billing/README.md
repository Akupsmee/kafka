- Billing Srervice is a consumer at the same time, subscribes to the response from a sent message, which makes it a producer also, so Producer/Consumer

- Auth Service is a pure Consumer and uses the @messagePattern() to enable subscribing to its response from the  Billing Service,

- Api Gateway, is a producer, emits messages which are consumed by the billing service

### install kafka on mac rather than using docker compose
$ brew cask install java
$ brew install Kafka


#### To start Zookeeper:
- zookeeper-server-start /usr/local/etc/kafka/zookeeper.properties

- Note: Zookeeper should be always started before starting the Kafka server.

#### To start Kafka:
- kafka-server-start /usr/local/etc/kafka/server.properties

#### Lets check whether Kafka is working properly
##### To create a topic:
- kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic my-first-topic

#### To create a Producer console:
- kafka-console-producer --broker-list localhost:9092 --topic my-first-topic

#### To create a Consumer console:
- kafka-console-consumer --bootstrap-server localhost:9092 --topic my-first-topic --from-beginning
