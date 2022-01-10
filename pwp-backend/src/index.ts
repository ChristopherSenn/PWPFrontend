import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import { RegisterRoutes } from './routes';

import * as swaggerJson from './swagger.json';
import * as swaggerUI from 'swagger-ui-express';
import { connectToDatabase } from './db/databaseConnection';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

const allowedOrigins = ['http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

const port = process.env.PORT || 4500;

app.use(cors(corsOptions));
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
});

// Register error handler
app.use(errorHandler);
