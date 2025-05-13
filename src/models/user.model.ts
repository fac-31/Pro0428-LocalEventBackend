import { z } from 'https://deno.land/x/zod/mod.ts';
import { ObjectId } from '../../deps.ts';

export const UserInputSchema = z.object({
  name_first: z.string().optional(),
  name_last: z.string().optional(),
  email: z.string().email(),
  username: z.string().optional(),
  password: z.string().min(6), // plain-text
});

export type UserInput = z.infer<typeof UserInputSchema>;

export interface UserInDB {
  _id?: ObjectId;
  name_first?: string;
  name_last?: string;
  email: string;
  username?: string;
  password: string; // hashed
  saved_events: ObjectId[];
}

export type SafeUser = Omit<UserInDB, 'password'>;

export const toSafeUser = (user: UserInDB): SafeUser => {
  const { password: _password, ...safeUser } = user;
  return safeUser;
};
