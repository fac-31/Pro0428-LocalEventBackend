import { Router } from '../../deps.ts';
import { getAllEvents, getEvent } from '../controllers/event.controller.ts';

const router = new Router();

// Routes under /events

// -> to controllers
router.get('/', getAllEvents);
router.get('/:id', getEvent);
// router.post("/")
// router.put("/:id", updateEvent)
// router.delete("/:id", deleteEvent)

// router.post("/generate", generateEvents) (using the openAi service)

export default router;
