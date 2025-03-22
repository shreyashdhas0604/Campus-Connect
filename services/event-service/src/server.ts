import express from 'express';
import { sendMessage } from './kafka/producer';
import { runConsumer } from './kafka/consumer';
import { connectConsumer,connectProducer } from './kafka/kafkaConfig';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 8082;


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

async function startEventServiceServe(){
  try {
    console.log("Starting Event Service...");
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
   
    app.get('/', (req, res) => {
      res.send('Event Service is running!');
    });

    app.listen(port, () => {
      console.log(`Event-Service Server started on port ${port}`);
    }); 

    await startKafkaService();


  } catch (error) {
    console.error("Error starting Event Service:", error );
    
  }
}


startEventServiceServe();