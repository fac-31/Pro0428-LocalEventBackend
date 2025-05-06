import { Router } from '../../deps.ts';

const router = new Router();

// Routes under /auth

// Temporary stub for testing
router.get('/', (ctx) => {
  ctx.response.body = 'Auth route root';
});

// -> to controllers
// router.get("/me", getCurrentUser)
// router.post("/signup", signUpUser)
// router.post("/login", loginUser)
// router.post("/logout", logoutUser)

export default router;
