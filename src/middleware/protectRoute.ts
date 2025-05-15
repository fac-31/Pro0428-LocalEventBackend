import { Status } from 'jsr:@oak/commons@1/status';
import { Context, Next } from '../../deps.ts';
import { verifyToken } from '../utils/token.utils.ts';

const ProtectRoute = async (ctx: Context, next: Next) => {
  const auth = ctx.request.headers.get('Authorization');
  if (!auth) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { error: 'No token provided' };
    return;
  }

  const token = auth.split(' ')[1];
  try {
    const payload = await verifyToken(token);
    if (!payload) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = { message: 'Unauthorized: Invalid token' };
      return;
    }
    ctx.state.user = payload;
    console.log(payload);
    await next();
  } catch (error) {
    if (error instanceof Error) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = { error: error.message };
      console.error(error.message);
    } else {
      ctx.response.body = { error: 'Unkown error verifying token' };
      console.error(error);
    }
  }
};

export default ProtectRoute;
