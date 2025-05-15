// deno-lint-ignore-file require-await
import { Context, RouterContext } from '../../deps.ts';
import { UserLogInSchema, UserSignUpSchema } from '../models/user.model.ts';
import { authService } from '../services/auth.service.ts';

export const getCurrentUser = async (ctx: Context) => {
  const user = ctx.state.user;

  if (!user) {
    ctx.response.status = 401;
    ctx.response.body = { message: 'User not authenticated' };
    return;
  }
  ctx.response.body = {
    message: `Hello, ${user.email}!`,
    user,
  };
};

export const signUpUser = async (ctx: RouterContext<'/signup'>) => {
  const body = await ctx.request.body.json();
  const userInput = UserSignUpSchema.safeParse(body);

  if (!userInput.success) {
    ctx.response.status = 400;
    ctx.response.body = { errors: userInput.error.flatten() };
    return;
  }
  try {
    const insertedId = await authService.createUser(userInput.data);
    ctx.response.status = 201;
    ctx.response.body = insertedId;
  } catch (error) {
    ctx.response.status = 500;
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
    ctx.response.status = 400;
    ctx.response.body = { errors: userInput.error.flatten() };
    console.error(userInput.error);
    return;
  }
  try {
    const token = await authService.logInUser(userInput.data);
    ctx.response.status = 200;
    ctx.response.body = { token };
  } catch (error) {
    if (error instanceof Error) {
      ctx.response.status = 401;
      ctx.response.body = { error: error.message };
      console.error(error.message);
    } else {
      ctx.response.body = { error: 'Unkown error creating token' };
      console.error(error);
    }
  }
};

export const logoutUser = async (ctx: Context) => {
  // TODO: Invalidate token or session
  ctx.response.body = { message: 'Log out user' };
};
