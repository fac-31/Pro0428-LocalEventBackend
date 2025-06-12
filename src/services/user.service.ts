// interacts with mongoDb:
// getUserById
// updateUserById
// deleteUserById

import 'https://deno.land/std@0.224.0/dotenv/load.ts';
import { db } from '../database/connect.ts';
import { UserInDB } from 'models/user.model.ts';
import { hash, ObjectId, OptionalId } from '../../deps.ts';
import { NewUser } from 'models/user.model.ts';
import { FullEvent } from '../../shared/src/models/event.model.ts';

const users = db.collection<OptionalId<UserInDB>>('users');
const events = db.collection<FullEvent>('events');

const getAllUsers = async (
  role: 'user' | 'admin' | 'all',
): Promise<UserInDB[]> => {
  const query = role !== 'all' ? { role } : {};
  return await users.find(query).toArray();
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

const handleUserEvents = async (
  eventId: string,
  userId: string,
  saving: boolean,
) => {
  console.log(saving);
  if (saving === true) {
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { saved_events: new ObjectId(eventId) } },
    );
  } else {
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { saved_events: new ObjectId(eventId) } },
    );
  }
};

const getUserEvents = async (userId: string) => {
  const user = await users.findOne({ _id: new ObjectId(userId) });
  const savedEvents = user?.saved_events ?? [];
  const eventsList = await events.find({ _id: { $in: savedEvents } }).toArray();
  return eventsList;
};

export const userService = {
  getAllUsers,
  handleUserEvents,
  getUserEvents,
};
/*
User clicks heart. Event target id? This is passed to backend via post request. Route grabs this. Calls this function via the
user controller. Save the id which should reference
*/
