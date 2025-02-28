import express from 'express';
import dotenv from 'dotenv';
import router from './routes/userRoutes';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import http from 'http';  

dotenv.config();
const app = express();
const port = process.env.PORT || 8081;
const prisma = new PrismaClient();

const server = http.createServer(app);

async function connectToDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1;`;
    console.log("Database connection successful");
  } catch (error) {
    console.error(`Error in connecting to database: ${error}`);
  }
}

async function closeDatabaseConnection() {
  try {
    await prisma.$disconnect();
    console.log("Database connection closed");
  } catch (error) {
    console.error(`Error in closing database connection: ${error}`);
  }
}

  async function InitializeUserServiceServer(){
    try {
      await connectToDatabase();
      app.use(cookieParser());
      app.use(express.json());
      app.use(cors(
        {
          origin : ["http://localhost:5173","http://localhost:8085"],
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
          credentials: true,
          exposedHeaders: ['set-cookie','Authorization'],
        }
      ));
      app.use('/', router);
      app.set('PORT', port);
      app.set('BASE_URL', process.env.BASE_URL || 'localhost');

      app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
      });
    } catch (error) {
      console.error(`Error in InitializeUserServiceServer: ${error}`);
    }
  }

  async function closeUserServiceServer(){
    try {
      await closeDatabaseConnection();
      server.close();
    } catch (error) {
      console.error(`Error in closeUserServiceServer: ${error}`);
    }
  }

  InitializeUserServiceServer();

  process.on('SIGINT', async () => {
    console.info('SIGINT signal received.');
    await closeUserServiceServer();
  });

  export default server;