import { Router } from '../../deps.ts';
import authRoutes from './auth.routes.ts';
import userRoutes from './user.routes.ts';
import eventRoutes from './event.routes.ts';

const router = new Router();

router.get('/', (ctx) => {
  ctx.response.body = 'Hello all you lovely locals!';
});

router.use('/auth', authRoutes.routes(), authRoutes.allowedMethods());
router.use('/users', userRoutes.routes(), userRoutes.allowedMethods());
router.use('/events', eventRoutes.routes(), eventRoutes.allowedMethods());

export default router;
