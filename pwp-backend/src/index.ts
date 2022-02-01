import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import { RegisterRoutes } from './routes';

import * as swaggerJson from './swagger.json';
import * as swaggerUI from 'swagger-ui-express';
import { connectToDatabase } from './db/databaseConnection';
import { errorHandler } from './middleware/errorHandler';
import { connectMqttClient } from './mqtt/mqtt';

export const app = express(); // Init express

const allowedOrigins = ['http://localhost:3000']; // Define allowed origins

// Setup cors with allowed origins
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

const port = process.env.PORT || 4500; // Set port

app.use(cors(corsOptions)); // Use cors settings
app.use(morgan('tiny')); // Request logging

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Autoregister routes from controller, setup Swagger UI
RegisterRoutes(app);
app.use(['/docs'], swaggerUI.serve, swaggerUI.setup(swaggerJson));

// Start Server
app.listen(port, async () => {
  console.log('Connecting to database...');
  await connectToDatabase();
  console.log('Connected to database!');
  console.log(`Example app listening at http://localhost:${port}`);
  console.log(`API Documentation at http://localhost:${port}/docs`);

  console.log('Connecting MQTT Client...');
  connectMqttClient(); // Connect the mqtt client
});

// Register error handler
app.use(errorHandler);
