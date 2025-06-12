import { Router } from '../../deps.ts';
import protectAdmin from '../middleware/requireAdmin.ts';
import ProtectRoute from '../middleware/protectRoute.ts';
import { getAllUsers, handleUserEvents } from '../controllers/user.controller.ts';


const router = new Router();

router.get('/getUsers:role', ProtectRoute, protectAdmin, getAllUsers);
router.post('/saveUserEvents', ProtectRoute, handleUserEvents);
export default router;