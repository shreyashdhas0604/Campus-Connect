import express from "express";
import { sendMessage } from "./kafka/producer";
import { runConsumer } from "./kafka/consumer";
import { connectConsumer, connectProducer } from "./kafka/kafkaConfig";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 8083;

const startKafkaService = async () => {
  try {
    console.log("Starting Kafka Service...");

    await connectProducer();
    await connectConsumer();
    await runConsumer();

    setTimeout(async () => {
      await sendMessage("Kafka-service-started", {
        message: "Kafka service has been started successfully!!",
      });
    }, 5000);

    console.log("Kafka Service started successfully.");
  } catch (error) {
    console.error("Error starting Kafka Service:", error);
  }
};

async function startClubSeviceServer() {
  try {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    app.get("/", (req, res) => {
      res.send("Club Service is running!");
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Club-Service Server started on port ${port}`);
    });

    await startKafkaService();
  } catch (error) {
    console.error("Error starting Club Service:", error);
  }
}

startClubSeviceServer();
 