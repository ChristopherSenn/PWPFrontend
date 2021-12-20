import { Request, Response } from 'express';

import { User } from '../models/user.model';

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().populate('role').sort('-createdAt').exec();

  return res.status(200).json({ data: users });
};

export { getAllUsers };
