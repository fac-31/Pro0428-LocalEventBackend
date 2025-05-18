import { Router } from '../../deps.ts';
import protectAdmin from '../middleware/requireAdmin.ts';
import ProtectRoute from '../middleware/protectRoute.ts'; 
import { getAllUsers } from '../controllers/user.controller.ts';
const router = new Router();

// Routes under /users

// Temporary stub for testing
router.get('/', (ctx) => {
  ctx.response.body = 'User route root';
});
router.get('/:role', ProtectRoute, protectAdmin, getAllUsers)
// -> to controllers
// router.get("/me", getUserProfile)
// router.put("/me", updateUserProfile)
// router.delete("/me", deleteUserAccount)

export default router;
