// deno-lint-ignore-file require-await
import { Context, Payload, RouterContext, toSafeUser } from '../../deps.ts';
import { userService } from '../services/user.service.ts';
import { Status } from '../../deps.ts';

import { ErrorResponse } from 'services/general.service.ts';
import { GetAllUsersSuccessResponse } from 'services/users.service.ts';

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
export const getAllUsers = async (ctx: RouterContext<'/getUsers:role'>) => {
  const role = ctx.params.role;

  if (role !== 'user' && role !== 'admin' && role !== 'all') {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = {
      error: 'Invalid role parameter. Use "user", "admin" or "all".',
    } as ErrorResponse;
    return;
  }

  try {
    const allUsers = await userService.getAllUsers(role);
    ctx.response.status = Status.OK;
    ctx.response.body = allUsers.map(toSafeUser) as GetAllUsersSuccessResponse;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Admin Error on getAllUsers: ${error.message}`);
    } else {
      throw new Error('Admin getAllUsers failed with an unknown error');
    }
  }
};

export const handleUserEvents = async (ctx: Context) => {
  try {
    const user: Payload = ctx.state.user;

    if (!user || !user._id) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = { message: 'Unauthorized: Invalid token' };
      return;
    }
    const body = await ctx.request.body.json();
    const { eventId, active } = body;
    const userId = user._id as string;

    await userService.handleUserEvents(eventId, userId, active);
    return ctx.response.body = 'User event handled';
  } catch (error) {
    console.error('Issue saving user events: ' + error);
  }
};
