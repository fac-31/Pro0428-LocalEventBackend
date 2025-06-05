// deno-lint-ignore-file require-await
import { Context, RouterContext, Status } from '../../deps.ts';
import {
  UserInDB,
  UserLogInSchema,
  UserSignUpSchema,
  UserUpdateSchema,
} from 'models/user.model.ts';
import { authService } from '../services/auth.service.ts';

export const getCurrentUser = async (ctx: Context) => {
  const user = ctx.state.user;
  if (!user) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: 'User not authenticated' };
    return;
  }
  ctx.response.body = {
    message: `Hello, ${user.username}!`,
    user,
  };
};

export const updateCurrentUser = async (ctx: RouterContext<'/me'>) => {
  const body = await ctx.request.body.json();
  const userUpdate = UserUpdateSchema.safeParse(body);
  const user: UserInDB = ctx.state.user;
  if (!user) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: 'User not authenticated' };
    return;
  }
  if (!userUpdate.success) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = { errors: userUpdate.error.flatten() };
    return;
  }
  try {
    const updatedUser = await authService.updateUser(user._id, userUpdate.data);
    ctx.response.status = Status.OK;
    ctx.response.body = updatedUser;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      ctx.response.status = Status.InternalServerError;
      ctx.response.body = { error: error.message };
    }
  }
};

export const signUpUser = async (ctx: RouterContext<'/signup'>) => {
  const body = await ctx.request.body.json();
  const userInput = UserSignUpSchema.safeParse(body);

  if (!userInput.success) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = { errors: userInput.error.flatten() };
    return;
  }
  try {
    const insertedId = await authService.createUser(userInput.data);
    ctx.response.status = Status.Created;
    ctx.response.body = insertedId;
  } catch (error) {
    ctx.response.status = Status.InternalServerError;
    if (error instanceof Error) {
      ctx.response.body = { error: error.message };
    } else {
      ctx.response.body = { error: 'Unkown error creating user' };
    }
  }
};

export const loginUser = async (ctx: RouterContext<'/login'>) => {
  const body = await ctx.request.body.json();
  const userInput = UserLogInSchema.safeParse(body);
  if (!userInput.success) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = { errors: userInput.error.flatten() };
    console.error(userInput.error);
    return;
  }
  try {
    const token = await authService.logInUser(userInput.data);
    ctx.response.status = Status.OK;
    ctx.response.body = { token };
  } catch (error) {
    if (error instanceof Error) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = { error: error.message };
      console.error(error.message);
    } else {
      ctx.response.status = Status.InternalServerError;
      ctx.response.body = { error: 'Unkown error creating token' };
      console.error(error);
    }
  }
};

export const logoutUser = async (ctx: Context) => {
  // TODO: Invalidate token or session
  ctx.response.body = { message: 'Log out user' };
};
