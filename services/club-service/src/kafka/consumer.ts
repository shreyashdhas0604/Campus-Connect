import { consumer, connectConsumer } from "./kafkaConfig";

export const runConsumer = async () => {
  await connectConsumer();

  await consumer.subscribe({ topic: "Kafka-service-started", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `Received message from topic ${topic}:`,
        message.value?.toString()
      );
    },
  });
};

// runConsumer();
