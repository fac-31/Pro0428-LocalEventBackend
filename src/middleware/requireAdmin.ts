import { Status, Next, Context } from '../../deps.ts';

const protectAdmin = async (ctx: Context, next: Next) => {
    const user = ctx.state.user;

    if (!user) {
        ctx.response.status = Status.Unauthorized;
        ctx.response.body = { error: 'User not authenticated' };
        return;
    };

    if (user.role !== 'admin') {
        ctx.response.status = Status.Forbidden;
        ctx.response.body = {error: 'Access is Admin Only'};
        return;
    };

    await next();
}

export default protectAdmin;