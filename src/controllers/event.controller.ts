import { Context, ObjectId, RouterContext, Status } from '../../deps.ts';
import { eventService } from '../services/event.service.ts';
import { generateEvents } from '../services/openai.service.ts';
import { eventFilterSchema, FullEvent } from 'models/event.model.ts';
import { verifyToken } from '../utils/token.utils.ts';
import { Payload } from '../../deps.ts';
import { userService } from '../services/user.service.ts';

export const getAllEvents = async (ctx: Context) => {
  const auth = ctx.request.headers.get('Authorization');
  const token = auth && auth.split(' ')[1];

  let userId: string | null = null;
  if (token) {
    try {
      const user: Payload = await verifyToken(token);
      userId = user._id as string;
    } catch (error) {
      console.warn('Invalid token in /events/with-saved: ' + error);
    }
  }

  const params = ctx.request.url.searchParams;
  const rawModes = params.getAll('mode');
  const normalizedModes = rawModes
    .flatMap((param) => param.split(','))
    .map((mode) => mode.trim().toLowerCase())
    .filter(Boolean);

  const parseResult = eventFilterSchema.safeParse({
    mode: normalizedModes.length > 0 ? normalizedModes : undefined,
  });

  if (!parseResult.success) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = {
      error: 'Invalid query parameters',
      details: parseResult.error.format(),
    };
    return;
  }

  try {
    const [allEvents, savedEvents] = await Promise.all([
      eventService.getAllEvents(parseResult.data),
      userId ? userService.getUserEvents(userId) : Promise.resolve([]),
    ]);

    ctx.response.body = {
      events: allEvents,
      savedEventIds: savedEvents.map((x) => x._id),
    };
  } catch (err) {
    console.error('Error fetching combined event data:', err);
    ctx.response.status = Status.InternalServerError;
    ctx.response.body = { error: 'Internal server error' };
  }
};

export const getEventById = async (ctx: RouterContext<'/:id'>) => {
  // TODO fix type checking Context not having "params"
  const id: string = ctx.params.id;

  if (!ObjectId.isValid(id)) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = `Invalid event id "${id}"`;
    return;
  }

  const event = await eventService.getEventById(id);

  if (!event) {
    ctx.response.status = Status.NotFound;
    ctx.response.body = `Event id "${id}" does not exist`;
    return;
  }

  ctx.response.body = event;
};

export const updateEventById = async (ctx: RouterContext<'/:id'>) => {
  const user = ctx.state.user;

  if (!user) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: 'User not authenticated' };
    return;
  }

  const id: string = ctx.params.id;
  const event: Partial<FullEvent> = await ctx.request.body.json();
  console.log(event);
  if (!ObjectId.isValid(id)) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = `Invalid event id "${id}"`;
    return;
  }

  if (!eventService.isEvent(event)) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = `Failed to validate event body`;
    return;
  }

  const result = await eventService.updateEventById(id, event);

  if (!result.acknowledged) {
    ctx.response.status = Status.NotFound;
    ctx.response.body = `Failed to update event by id "${id}"`;
    return;
  }

  ctx.response.body = { message: `Updated event id "${id}"` };
};

export const deleteEventById = async (ctx: RouterContext<'/:id'>) => {
  const user = ctx.state.user;

  if (!user) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: 'User not authenticated' };
    return;
  }

  const id: string = ctx.params.id;

  if (!ObjectId.isValid(id)) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = `Invalid event id "${id}"`;
    return;
  }

  const result = await eventService.deleteEventById(id);

  if (result.deletedCount == 0) {
    ctx.response.status = Status.NotFound;
    ctx.response.body = `Could not find event id "${id}"`;
    return;
  }

  ctx.response.body = { message: `Successfully deleted event id "${id}"` };
};

export const saveNewEvent = async (ctx: Context) => {
  // Things to note. Will this need admin authorisation? Possible need to implement token auth on this route or admin auth middleware?
  const event = await ctx.request.body.json();

  if (eventService.isEvent(event)) {
    eventService.saveEvents(event);
    ctx.response.body = 'Event saved sucessfully';
  } else {
    ctx.response.body = 'Create new event failed: Validation Error';
  }
};

export const saveEventsCronHandler = async (ctx: Context) => {
  console.log('Server pinged');
  const token = ctx.request.headers.get('X-Daily-Token');

  // Change this to appropriate .env or github secret
  const expectedToken = Deno.env.get('DAILY_JOB_TOKEN');

  if (token !== expectedToken) {
    ctx.response.status = Status.Forbidden;
    ctx.response.body = 'Forbidden';
    return;
  }

  console.log('Daily task triggered');

  const events = await generateEvents(
    ['music', 'charity', 'sports', 'other'],
    'Finsbury Park',
  );

  if (events !== null) {
    await eventService.saveEvents(events);
    ctx.response.body = 'Events saved sucessfully';
    console.log('Events saved');
  } else {
    ctx.response.status = Status.NoContent;
    ctx.response.body = 'No events to save';
    console.log('There were no events to save');
  }
};
