import express from 'express';
import cors from 'cors';
import { connectConsumer, connectProducer, runConsumer } from './kafka/kafkaConfig';
import { sendMessage } from './kafka/producer';
import clubRoutes from './routes/clubRoutes';
import membershipRoutes from './routes/membershipRoutes';
import activityRoutes from './routes/activityRoutes';

const app = express();
const port = process.env.PORT || 8083;

const startKafkaService = async () => {
  try {
    // Add delay to ensure Kafka is ready
    await new Promise(resolve => setTimeout(resolve, 10000));
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
    // Continue running the service even if Kafka fails
    console.log("Continuing without Kafka...");
  }
};

async function startClubServiceServer() {
  try {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Move CORS before routes
    app.use(cors({
      origin: true, // Allow all origins in development
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Authorization'],
      preflightContinue: false,
      optionsSuccessStatus: 204
    }));

    // Add error handling middleware
    app.use((err: any, req: any, res: any, next: any) => {
      console.error('Error:', err);
      res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
      });
    });
    
    // Mount routes with the correct prefix
    app.use('/', clubRoutes);         // Updated path
    app.use('/', membershipRoutes);   // Updated path
    app.use('/', activityRoutes);     // Updated path

    app.get("/", (req, res) => {
      res.send("Club Service is running!");
    });

    app.listen(port, () => {
      console.log(`Club-Service Server started on port ${port}`);
    });

    await startKafkaService();
  } catch (error) {
    console.error("Error starting Club Service:", error);
  }
}

startClubServiceServer();
 