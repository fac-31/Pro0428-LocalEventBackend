import { Router } from '../../deps.ts';
import {
  getAllEvents,
  getEventById,
  updateEventById,
  deleteEventById,
  saveEventsCronHandler,
  saveNewEvent,
} from '../controllers/event.controller.ts';
import ProtectRoute from '../middleware/protectRoute.ts';
import protectAdmin from '../middleware/requireAdmin.ts';

const router = new Router();

// Routes under /events

// -> to controllers
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put("/:id", ProtectRoute, protectAdmin, updateEventById)
router.delete("/:id", deleteEventById)
router.post('/save-event', saveNewEvent);
router.post('/cron/save-events', saveEventsCronHandler);
// router.post("/")

// router.post("/generate", generateEvents) (using the openAi service)

export default router;
