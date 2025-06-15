import { db } from '../database/connect.ts';
import {
  NewUser,
  toSafeUser,
  UserInDB,
  UserLogInInput,
  UserSignUpInput,
  UserUpdateSchema,
} from 'https://raw.githubusercontent.com/fac-31/Pro0428-LocalEventShared/main/src/models/user.model.ts';
import { compareSync, hashSync } from '../../deps.ts';
import { generateToken } from '../utils/token.utils.ts';
import { ObjectId, OptionalId } from '../../deps.ts';
import { emailService } from './email.services.ts';

const users = db.collection<OptionalId<UserInDB>>('users');

const createUser = async (userInput: UserSignUpInput) => {
  console.log('🍎Create user called');
  try {
    console.log('🍎Checking for existing user...');
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

    console.log('🍎hashing password...');
    const passwordHash = hashSync(userInput.password);
    // const passwordHash = compareSync(userInput.password, hash);
    console.log('🍎Password hashed successfully');
    const userToInsert: NewUser = {
      ...userInput,
      password: passwordHash,
      saved_events: [],
      role: 'user',
    };
    console.log('🍎User to insert:', { ...userToInsert, password: '[HIDDEN]' });

    const result = await users.insertOne(userToInsert);
    console.log('🍎User inserted into DB');
    if (!result) throw new Error('Failed to insert user');
    return result;
  } catch (error) {
    console.error('Error in create user:', error);
    throw error;
  }
};

const updateUser = async (id: string | ObjectId, updates: UserUpdateSchema) => {
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  const orConditions = [];

  if (updates.email) {
    orConditions.push({ email: updates.email });
  }

  if (updates.username) {
    orConditions.push({ username: updates.username });
  }

  if (orConditions.length > 0) {
    const conflict = await users.findOne({
      _id: { $ne: objectId },
      $or: orConditions,
    });

    if (conflict) {
      if (conflict.email === updates.email) {
        throw new Error('Email already in use');
      }
      if (conflict.username === updates.username) {
        throw new Error('Username already in use');
      }
    }
  }

  const { matchedCount, modifiedCount } = await users.updateOne(
    { _id: objectId },
    { $set: updates }
  );
  console.log(`found ${matchedCount} match and made ${modifiedCount} changes.`);
  if (matchedCount === 0) throw new Error('User not found');
  const updated = await users.findOne({ _id: objectId });
  if (!updated) throw new Error('Something went wrong');
  const safeUpdated = toSafeUser(updated);
  return safeUpdated;
};

const logInUser = async (userInput: UserLogInInput) => {
  console.log('🍏 Login user called');
  console.log('🍏 Finding user');
  const exists = await users.findOne({ username: userInput.username });

  const validPassword =
    exists === null ? false : compareSync(userInput.password, exists.password);
  if (!(exists && validPassword)) {
    throw new Error('Invalid username or password');
  }
  console.log('🍏 User found');
  const safeUser = toSafeUser(exists);
  const token = await generateToken(safeUser);
  console.log('🍏 Returning user token');
  return token;
};

const refreshUserToken = async (id: string | ObjectId) => {
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  const user = await users.findOne({ _id: objectId });
  if (!user) throw new Error('User not found');
  const safeUser = toSafeUser(user);
  return await generateToken(safeUser);
};

const FRONTEND_URL = Deno.env.get('FRONTEND_URL');
console.log(FRONTEND_URL);

const handlePasswordResetRequest = async (email: string) => {
  const exists = await users.findOne({ email });
  if (!exists) return; // This is a silent fail for security reasons
  const safeUser = toSafeUser(exists);
  const token = await generateToken(safeUser);
  const magicLink = `${FRONTEND_URL}reset-password?token=${token}`;
  console.log('magic link:');
  console.log(magicLink);
  await emailService.sendMagicLink(email, magicLink);
};

export const authService = {
  createUser,
  updateUser,
  logInUser,
  refreshUserToken,
  handlePasswordResetRequest,
};
