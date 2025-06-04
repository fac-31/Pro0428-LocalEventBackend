import { Context, Next } from '../../deps.ts';

const logRequest = async (ctx: Context, next: Next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${ctx.request.method} ${ctx.request.url}`);
  await next();
};

export default logRequest;
