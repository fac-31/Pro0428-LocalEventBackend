// interacts with mongoDb:
// getUserById
// updateUserById
// deleteUserById

import 'https://deno.land/std@0.224.0/dotenv/load.ts';
import { db } from '../database/connect.ts';
import { UserInDB } from '../models/user.model.ts';
import { hash, OptionalId } from '../../deps.ts';
import { NewUser } from '../models/user.model.ts';

const users = db.collection<OptionalId<UserInDB>>('users');

const getAllUsers = async (role?: 'user' | 'admin'): Promise<UserInDB[]> => {
  const query = role ? { role } : {};
  return await users.find(query).toArray();
};

export const userService = {
  getAllUsers,
};

const _createAdmin = async () => {
  const passwordHash = await hash('supersecretadminpassword');
  const userToInsert: NewUser = {
    email: 'admin@example.com',
    username: 'admin',
    password: passwordHash,
    name_first: 'Admin',
    name_last: 'User',
    saved_events: [],
    role: 'admin',
  };
  const result = await users.insertOne(userToInsert);

  console.log('Admin created:', result);
};
