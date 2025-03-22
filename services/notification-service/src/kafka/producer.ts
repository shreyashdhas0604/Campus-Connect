import { producer, connectProducer } from "./kafkaConfig";

export const sendMessage = async (topic: string, message: object) => {
  await connectProducer();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log(`Message sent to topic ${topic}:`, message);
};

// Example usage
// sendMessage("Kafka-service-started", { message: "Kafka service has been started successfully!!" });
