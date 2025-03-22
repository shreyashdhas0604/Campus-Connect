import { sendMessage } from './kafka/producer';
import { runConsumer } from './kafka/consumer';
import { connectConsumer,connectProducer } from './kafka/kafkaConfig';
import express from 'express';

const app = express();
const port = process.env.PORT || 8084;

app.use(express.json());


app.get('/health', (req, res) => {
  res.send('Notification Service is running!');
});

async function startServer() {
  try {
    app.listen(port, () => {
      console.log(`Notification-Service Server started on port ${port}`);
    });

    startKafkaService();
    
  } catch (error) {
    console.error('Error starting Notification server:', error);
  }
}


const startKafkaService = async () => {
  try {
    console.log("Starting Kafka Service...");

    await connectProducer();
    await connectConsumer();
    await runConsumer();

    setTimeout(async () => {
      await sendMessage("Kafka-service-started", { message: "Kafka service has been started successfully!!" });
    }, 5000);

  } catch (error) {
    console.error("Error starting Kafka Service:", error);
  }
};

startServer();
