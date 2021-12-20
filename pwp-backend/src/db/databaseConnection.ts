import mongoose from 'mongoose';
import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
dotenv.config();

const connection = process.env.ATLAS_URI || '';

const connectToDatabase = async (): Promise<void> => {
  // const options: ConnectionOptions = { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true };

  await mongoose.connect(connection);
  // await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
};

export { connectToDatabase };
