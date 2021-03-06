import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
// import https from 'https';
// import http from 'http';
import fs from 'fs';
import path from 'path';

import { RegisterRoutes } from './routes';

import * as swaggerJson from './swagger.json';
import * as swaggerUI from 'swagger-ui-express';
import { connectToDatabase } from './db/databaseConnection';
import { errorHandler } from './middleware/errorHandler';
import { connectMqttClient } from './mqtt/mqtt';

const httpolyglot = require('httpolyglot'); // httpolyglot has no @tpyes implementation, hence implement it this way

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

// This is only used for local testing of https, remove in production
const clientKeyPath = path.join(__dirname, './', 'mqtt', 'certificates', 'client.key'); // Get client CA Certificate Key File
const clientPemPath = path.join(__dirname, './', 'mqtt', 'certificates', 'client.pem'); // Get client CA Certificate Pem File

// Setup server to run over http and https with the same port
httpolyglot
  .createServer(
    {
      // Test Certificate (not valid)
      key: fs.readFileSync(clientKeyPath, 'utf8'), // Set CA Key
      cert: fs.readFileSync(clientPemPath, 'utf8'), // Set CA Pem File
      // Production certificate
      // key: fs.readFileSync('/etc/letsencrypt/live/pwp21.medien.ifi.lmu.de/fullchain.pem'),
      // cert: fs.readFileSync('/etc/letsencrypt/live/pwp21.medien.ifi.lmu.de/privkey.pem'),
    },
    app
  )
  .listen(port, async () => {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database!');
    console.log(`Https server listening at https://localhost:${port}`);
    console.log(`Http server listening at http://localhost:${port}`);
    console.log('');
    console.log(`API Documentation at https://localhost:${port}/docs or http://localhost:${port}/docs`);

    console.log('Connecting MQTT Client...');
    connectMqttClient(); // Connect the mqtt client
  });

// Setup server to run over https on a dedicated port. Can be used if server should only support https or if https and http should be on different ports
/* const httpsServer = https.createServer(
  {
    key: fs.readFileSync(clientKeyPath, 'utf8'), // Set CA Key
    cert: fs.readFileSync(clientPemPath, 'utf8'), // Set CA Pem File
    // key: fs.readFileSync('/etc/letsencrypt/live/pwp21.medien.ifi.lmu.de/fullchain.pem'),
    // cert: fs.readFileSync('/etc/letsencrypt/live/pwp21.medien.ifi.lmu.de/privkey.pem'),
  },
  app
);
httpsServer.listen(port, async () => {
  console.log('Connecting to database...');
  await connectToDatabase();
  console.log('Connected to database!');
  console.log(`Https server listening at https://localhost:${port}`);
  console.log(`API Documentation at https://localhost:${port}/docs`);
  console.log('Connecting MQTT Client...');
  connectMqttClient(); // Connect the mqtt client
}); */

// Setup server to run over http on a dedicated port. Can be used if https and http should be on different ports
/* const httpServer = http.createServer(app);
httpServer.listen(4501, async () => {
  console.log('Connecting to database...');
  await connectToDatabase();
  console.log('Connected to database!');
  console.log(`Http server listening at http://localhost:${port}`);
  console.log(`API Documentation at http://localhost:${port}/docs`);
  console.log('Connecting MQTT Client...');
  connectMqttClient(); // Connect the mqtt client
}); */

// Start Server over http only
/* app.listen(port, async () => {
  console.log('Connecting to database...');
  await connectToDatabase();
  console.log('Connected to database!');
  console.log(`Example app listening at http://localhost:${port}`);
  console.log(`API Documentation at http://localhost:${port}/docs`);
  console.log('Connecting MQTT Client...');
  connectMqttClient(); // Connect the mqtt client
}); */

// Register error handler
app.use(errorHandler);
