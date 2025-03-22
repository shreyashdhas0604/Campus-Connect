import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

export const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "notification-service-group" });

export const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer connected");
};

export const connectConsumer = async () => {
  await consumer.connect();
  console.log("Kafka Consumer connected");
};
