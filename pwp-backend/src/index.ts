import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

// import { roleRoute } from './routes/role.route';

import { connectToDatabase } from './db/databaseConnection';
import { userRoute } from './routes/user.route';

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

const allowedOrigins = ['http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

const app = express();

app.use(cors(corsOptions));
app.use(morgan('tiny'));

app.use('/', userRoute());

app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello World' });
});

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Application started on URL ${HOST}:${PORT} !`);
});
