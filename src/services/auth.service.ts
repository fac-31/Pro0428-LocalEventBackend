import { db } from '../database/connect.ts';
import {
  NewUser,
  toSafeUser,
  UserInDB,
  UserLogInInput,
  UserSignUpInput,
} from "https://raw.githubusercontent.com/fac-31/Pro0428-LocalEventShared/main/src/models/user.model.ts";
import { compareSync, hashSync } from '../../deps.ts';
import { generateToken } from '../utils/token.utils.ts';
import type { OptionalId } from '../../deps.ts';

const users = db.collection<OptionalId<UserInDB>>('users');

const createUser = async (userInput: UserSignUpInput) => {
console.log("🍎Create user called");
 try {
  console.log("🍎Checking for existing user...")
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
    
    console.log("🍎hashing password...")
    const passwordHash = hashSync(userInput.password);
    // const passwordHash = compareSync(userInput.password, hash);
    console.log('🍎Password hashed successfully')
    const userToInsert: NewUser = {
      ...userInput,
      password: passwordHash,
      saved_events: [],
      role: 'user',
    };
    console.log('🍎User to insert:', { ...userToInsert, password: '[HIDDEN]' });
    
    const result = await users.insertOne(userToInsert);
    console.log('🍎User inserted into DB')
    if (!result) throw new Error('Failed to insert user');
    return result;

  } catch (error) {
    console.error("Error in create user:", error);
    throw error;
  }
};

const logInUser = async (userInput: UserLogInInput) => {
  console.log("🍏 Login user called")
  console.log("🍏 Finding user")
  const exists = await users.findOne({ username: userInput.username });

  const validPassword = exists === null
    ? false
    : compareSync(userInput.password, exists.password);
  if (!(exists && validPassword)) {
    throw new Error('Invalid username or password');
  }
  console.log("🍏 User found")
  const safeUser = toSafeUser(exists);
  const token = await generateToken(safeUser);
  console.log("🍏 Returning user token")
  return token;
};

export const authService = {
  createUser,
  logInUser,
};
