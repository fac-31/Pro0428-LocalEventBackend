import { Router } from '../../deps.ts';

const router = new Router();

// Routes under /users

// Temporary stub for testing
router.get('/', (ctx) => {
  ctx.response.body = 'User route root';
});

// -> to controllers
// router.get("/me", getUserProfile)
// router.put("/me", updateUserProfile)
// router.delete("/me", deleteUserAccount)

export default router;
