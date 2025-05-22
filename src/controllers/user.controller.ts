// deno-lint-ignore-file require-await
import { Context, RouterContext } from '../../deps.ts';
import { userService } from '../services/user.service.ts';
import { Status } from '../../deps.ts';
import { toSafeUser } from '../models/user.model.ts';
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
export const getAllUsers = async (ctx: RouterContext<'/:role'>) => {
  const role = ctx.params.role;

  if (role !== 'user' && role !== 'admin' && role !== 'all') {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = {
      error: 'Invalid role parameter. Use "user", "admin" or "all".',
    };
    return;
  }

  try {
    const allUsers = await userService.getAllUsers(role);
    ctx.response.status = Status.OK;
    ctx.response.body = allUsers.map(toSafeUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Admin Error on getAllUsers: ${error.message}`);
    } else {
      throw new Error('Admin getAllUsers failed with an unknown error');
    }
  }
};
