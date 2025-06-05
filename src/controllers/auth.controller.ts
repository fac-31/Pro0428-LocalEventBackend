// deno-lint-ignore-file require-await
import { Context, RouterContext, Status } from '../../deps.ts';
import { UserLogInSchema, UserSignUpSchema } from 'models/user.model.ts';
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

export const requestPasswordReset = async (
  ctx: RouterContext<'/request-password-reset'>
) => {
  const body = await ctx.request.body.json();
  const email = body?.email;
  if (!email) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = 'email required';
    return;
  }
  try {
    await authService.handlePasswordResetRequest(email);
  } catch (error) {
    if (error instanceof Error) console.error(error);
  }
  ctx.response.status = Status.OK;
  ctx.response.body = {
    message: 'If your email exists, a reset link will be sent shortly.',
  };
};

export const resetPassword = async (ctx: RouterContext<'/reset-password'>) => {
  const body = await ctx.request.body.json();
  console.log(body);
};
