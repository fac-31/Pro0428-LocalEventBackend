import { Router } from '../../deps.ts';
import {
  getAllEvents,
  getEventById,
  saveEventsCronHandler,
  saveNewEvent
} from '../controllers/event.controller.ts';

const router = new Router();

// Routes under /events

// -> to controllers
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/save-event', saveNewEvent)
router.post('/cron/save-events', saveEventsCronHandler);
// router.post("/")
// router.put("/:id", updateEvent)
// router.delete("/:id", deleteEvent)

// router.post("/generate", generateEvents) (using the openAi service)

export default router;
