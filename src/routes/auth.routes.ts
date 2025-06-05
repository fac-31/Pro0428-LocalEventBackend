import { Router } from '../../deps.ts';
import {
  getCurrentUser,
  loginUser,
  signUpUser,
  updateCurrentUser
} from '../controllers/auth.controller.ts';
import ProtectRoute from '../middleware/protectRoute.ts';

const router = new Router();

// Routes under /auth
router.get('/me', ProtectRoute, getCurrentUser);
router.put('/me', ProtectRoute, updateCurrentUser)
router.post('/signup', signUpUser);
router.post('/login', loginUser);
// router.post("/logout", logoutUser)

export default router;
