// deno-lint-ignore-file require-await
import { Context } from '../../deps.ts';

export const getUserProfile = async (ctx: Context) => {
  // TODO: Get user data from ctx.state.user
  ctx.response.body = { message: 'Get user profile' };
};

export const updateUserProfile = async (ctx: Context) => {
  // TODO: Parse update body, validate, call service
  ctx.response.body = { message: 'Update user profile' };
};

export const deleteUserAccount = async (ctx: Context) => {
  // TODO: Call userService.deleteUser(ctx.state.user.id)
  ctx.response.body = { message: 'Delete user account' };
};
