import { Router } from '../../deps.ts';
import {
  getCurrentUser,
  loginUser,
  signUpUser,
  requestPasswordReset,
  resetPassword,
} from '../controllers/auth.controller.ts';
import ProtectRoute from '../middleware/protectRoute.ts';

const router = new Router();

// Routes under /auth
router.get('/me', ProtectRoute, getCurrentUser);
router.post('/signup', signUpUser);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', ProtectRoute, resetPassword);

export default router;
