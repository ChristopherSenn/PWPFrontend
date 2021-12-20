import { Router } from 'express';
import { getAllUsers } from '..//controllers/user.controller';

const userRoute = () => {
  const router = Router();

  router.get('/users', getAllUsers);

  return router;
};

export { userRoute };
