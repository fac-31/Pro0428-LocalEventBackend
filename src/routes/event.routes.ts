import { Router } from '../../deps.ts';

const router = new Router();

// Routes under /events

// Temporary stub for testing
router
  .get('/', (ctx) => {
    ctx.response.body = 'events route root';
  });

// -> to controllers
// router.get("/", getAllEvents)
// router.get("/:id", getEvent)
// router.post("/")
// router.put("/:id", updateEvent)
// router.delete("/:id", deleteEvent)

// router.post("/generate", generateEvents) (using the openAi service)

export default router;
