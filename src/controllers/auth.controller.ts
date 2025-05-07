// deno-lint-ignore-file require-await
import { Context } from '../../deps.ts';

export const getCurrentUser = async (ctx: Context) => {
  // TODO: Extract user from ctx.state (after auth middleware)
  ctx.response.body = { message: 'Get current user' };
};

export const signUpUser = async (ctx: Context) => {
  // TODO: Parse and validate signup body, call userService.createUser
  ctx.response.body = { message: 'Sign up user' };
};

export const loginUser = async (ctx: Context) => {
  // TODO: Validate credentials, issue token or session
  ctx.response.body = { message: 'Log in user' };
};

export const logoutUser = async (ctx: Context) => {
  // TODO: Invalidate token or session
  ctx.response.body = { message: 'Log out user' };
};
