import { db } from '../database/connect.ts';
import { toSafeUser, UserInDB, UserInput } from '../models/user.model.ts';
import { compare, hash } from 'https://deno.land/x/bcrypt/mod.ts';
import { generateToken } from '../utils/token.utils.ts';

const users = db.collection<UserInDB>('users');

const createUser = async (userInput: UserInput) => {
  const exists = await users.findOne({ email: userInput.email });
  if (exists) {
    throw new Error('User with this email already exists');
  }

  const passwordHash = await hash(userInput.password);
  const userToInsert: UserInDB = {
    ...userInput,
    password: passwordHash,
    saved_events: [],
  };
  const insertedId = await users.insertOne(userToInsert);
  return insertedId;
};

const logInUser = async (userInput: UserInput) => {
  const exists = await users.findOne({ email: userInput.email });
  const validPassword = exists === null
    ? false
    : await compare(userInput.password, exists.password);
  if (!(exists && validPassword)) {
    throw new Error('Invalid username or password');
  }
  const safeUser = toSafeUser(exists);
  const token = await generateToken(safeUser);
  return token;
};

export const authService = {
  createUser,
  logInUser,
};
