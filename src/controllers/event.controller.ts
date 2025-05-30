// deno-lint-ignore-file require-await
import { Context, ObjectId, RouterContext, Status } from '../../deps.ts';
import { eventService } from '../services/event.service.ts';
import { generateEvents } from '../services/openai.service.ts';

export const getAllEvents = async (ctx: Context) => {
  const allEvents = await eventService.getAllEvents();
  ctx.response.body = allEvents;
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
    ['Music', 'Charity', 'Sports', 'Other'],
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

export const updateEvent = async (ctx: Context) => {
  // TODO: Update event in DB
  ctx.response.body = { message: `Update event of params.id` };
};

export const deleteEvent = async (ctx: Context) => {
  // TODO: Delete event from DB
  ctx.response.body = { message: `Delete event params.id` };
};
