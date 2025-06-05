import { db } from '../database/connect.ts';
import {
  NewUser,
  toSafeUser,
  UserInDB,
  UserLogInInput,
  UserSignUpInput,
  UserUpdateSchema,
} from 'models/user.model.ts';
import { compare, hash } from '../../deps.ts';
import { generateToken } from '../utils/token.utils.ts';
import { ObjectId, OptionalId } from '../../deps.ts';

const users = db.collection<OptionalId<UserInDB>>('users');

const createUser = async (userInput: UserSignUpInput) => {
  const existingUser = await users.findOne({
    $or: [{ email: userInput.email }, { username: userInput.username }],
  });

  if (existingUser) {
    if (existingUser.email === userInput.email) {
      throw new Error('User with this email already exists');
    }
    if (existingUser.username === userInput.username) {
      throw new Error('This username is already in use');
    }
  }
  const passwordHash = await hash(userInput.password);
  const userToInsert: NewUser = {
    ...userInput,
    password: passwordHash,
    saved_events: [],
    role: 'user',
  };
  const result = await users.insertOne(userToInsert);
  if (!result) throw new Error('Failed to insert user');
  return result;
};

const updateUser = async (id: string | ObjectId, updates: UserUpdateSchema) => {
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;

  const user = await users.findOne({ _id: objectId });
  console.log('Found user:', user);

  const { matchedCount } = await users.updateOne(
    { _id: objectId },
    { $set: updates }
  );

  if (matchedCount === 0) throw new Error('User not found');
  return await users.findOne({ _id: objectId });
};

const logInUser = async (userInput: UserLogInInput) => {
  const exists = await users.findOne({ username: userInput.username });
  const validPassword =
    exists === null
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
  updateUser,
  logInUser,
};
