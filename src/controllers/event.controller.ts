// deno-lint-ignore-file require-await
import { Context, ObjectId, RouterContext, Status } from '../../deps.ts';
import { eventService } from '../services/event.service.ts';

export const getAllEvents = async (ctx: Context) => {
  const allEvents = await eventService.getAllEvents();
  ctx.response.body = allEvents;
};

export const getEventById = async (ctx: RouterContext<string>) => {
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

export const createEvent = async (ctx: Context) => {
  // TODO: Validate input, create event in DB
  ctx.response.body = { message: 'Create new event' };
};

export const generateEvents = async (ctx: Context) => {
  // TODO: Use OpenAI API via service, then store generated events
  ctx.response.body = { message: 'Generate events from prompt' };
};

export const updateEvent = async (ctx: Context) => {
  // TODO: Update event in DB
  ctx.response.body = { message: `Update event of params.id` };
};

export const deleteEvent = async (ctx: Context) => {
  // TODO: Delete event from DB
  ctx.response.body = { message: `Delete event params.id` };
};
