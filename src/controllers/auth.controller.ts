// deno-lint-ignore-file require-await
import { Context, RouterContext, Status } from '../../deps.ts';
import { UserLogInSchema, UserSignUpSchema } from 'models/user.model.ts';
import { authService } from '../services/auth.service.ts';

import { ErrorResponse } from 'services/general.service.ts';
import {
  LoginErrorDetails,
  LoginErrorResponse,
  LoginSuccessResponse,
  MeSuccessResponse,
  SignupErrorDetails,
  SignupErrorResponse,
  SignupSuccessResponse,
} from 'services/auth.service.ts';

export const getCurrentUser = async (ctx: Context) => {
  const user = ctx.state.user;

  if (!user) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { error: 'User not authenticated' } as ErrorResponse;
    return;
  }
  ctx.response.body = {
    message: `Hello, ${user.username}!`,
    user,
  } as MeSuccessResponse;
};

export const signUpUser = async (ctx: RouterContext<'/signup'>) => {
  const body = await ctx.request.body.json();
  const userInput = UserSignUpSchema.safeParse(body);

  if (!userInput.success) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = {
      errors: userInput.error.flatten() as SignupErrorDetails,
    } as SignupErrorResponse;
    return;
  }
  try {
    const insertedId = await authService.createUser(userInput.data);
    ctx.response.status = Status.Created;
    ctx.response.body = insertedId as SignupSuccessResponse;
  } catch (error) {
    ctx.response.status = Status.InternalServerError;
    if (error instanceof Error) {
      ctx.response.body = { error: error.message } as ErrorResponse;
    } else {
      ctx.response.body = {
        error: 'Unkown error creating user',
      } as ErrorResponse;
    }
  }
};

export const loginUser = async (ctx: RouterContext<'/login'>) => {
  const body = await ctx.request.body.json();
  const userInput = UserLogInSchema.safeParse(body);
  if (!userInput.success) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = {
      errors: userInput.error.flatten() as LoginErrorDetails,
    } as LoginErrorResponse;
    console.error(userInput.error);
    return;
  }
  try {
    const token = await authService.logInUser(userInput.data);
    ctx.response.status = Status.OK;
    ctx.response.body = { token } as LoginSuccessResponse;
  } catch (error) {
    if (error instanceof Error) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = { error: error.message } as ErrorResponse;
      console.error(error.message);
    } else {
      ctx.response.status = Status.InternalServerError;
      ctx.response.body = {
        error: 'Unkown error creating token',
      } as ErrorResponse;
      console.error(error);
    }
  }
};

export const logoutUser = async (ctx: Context) => {
  // TODO: Invalidate token or session
  ctx.response.body = { message: 'Log out user' };
};
