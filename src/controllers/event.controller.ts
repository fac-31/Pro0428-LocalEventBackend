import { Context, ObjectId, RouterContext, Status } from '../../deps.ts';
import { eventService } from '../services/event.service.ts';
import { generateEvents } from '../services/openai.service.ts';

import { eventFilterSchema, FullEvent } from 'models/event.model.ts';
import { ErrorResponse, MessageResponse } from 'services/general.service.ts';
import { GetAllEventsErrorResponse } from 'services/events.service.ts';

export const getAllEvents = async (ctx: Context) => {
  const params = ctx.request.url.searchParams;

  const rawModes = params.getAll('mode');

  const normalizedModes = rawModes
    .flatMap((param) => param.split(','))
    .map((mode) => mode.trim().toLowerCase())
    .filter(Boolean); // removes empty strings

  const parseResult = eventFilterSchema.safeParse({
    mode: normalizedModes.length > 0 ? normalizedModes : undefined,
  });

  let allEvents;
  if (parseResult.success) {
    console.log(parseResult.data);
    allEvents = await eventService.getAllEvents(parseResult.data);
  } else {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = {
      error: 'Invalid query parameters',
      details: parseResult.error.format(),
    } as GetAllEventsErrorResponse;
    return;
  }

  ctx.response.body = allEvents;
};

export const getEventById = async (ctx: RouterContext<'/:id'>) => {
  // TODO fix type checking Context not having "params"
  const id: string = ctx.params.id;

  if (!ObjectId.isValid(id)) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = { error: `Invalid event id "${id}"` } as ErrorResponse;
    return;
  }

  const event = await eventService.getEventById(id);

  if (!event) {
    ctx.response.status = Status.NotFound;
    ctx.response.body = {
      error: `Event id "${id}" does not exist`,
    } as ErrorResponse;
    return;
  }

  ctx.response.body = event;
};

export const updateEventById = async (ctx: RouterContext<'/:id'>) => {
  const user = ctx.state.user;

  if (!user) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { error: 'User not authenticated' } as ErrorResponse;
    return;
  }

  const id: string = ctx.params.id;
  const event: FullEvent = await ctx.request.body.json();

  if (!ObjectId.isValid(id)) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = { error: `Invalid event id "${id}"` } as ErrorResponse;
    return;
  }

  if (!eventService.isEvent(event)) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = {
      error: `Failed to validate event body`,
    } as ErrorResponse;
    return;
  }

  const result = await eventService.updateEventById(id, event);

  if (!result.acknowledged) {
    ctx.response.status = Status.NotFound;
    ctx.response.body = {
      error: `Failed to update event by id "${id}"`,
    } as ErrorResponse;
    return;
  }

  ctx.response.body = {
    message: `Updated event id "${id}"`,
  } as MessageResponse;
};

export const deleteEventById = async (ctx: RouterContext<'/:id'>) => {
  const user = ctx.state.user;

  if (!user) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { error: 'User not authenticated' } as ErrorResponse;
    return;
  }

  const id: string = ctx.params.id;

  if (!ObjectId.isValid(id)) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = { error: `Invalid event id "${id}"` } as ErrorResponse;
    return;
  }

  const result = await eventService.deleteEventById(id);

  if (result.deletedCount == 0) {
    ctx.response.status = Status.NotFound;
    ctx.response.body = {
      error: `Could not find event id "${id}"`,
    } as ErrorResponse;
    return;
  }

  ctx.response.body = {
    message: `Successfully deleted event id "${id}"`,
  } as MessageResponse;
};

export const saveNewEvent = async (ctx: Context) => {
  // Things to note. Will this need admin authorisation? Possible need to implement token auth on this route or admin auth middleware?
  const event = await ctx.request.body.json();

  if (eventService.isEvent(event)) {
    eventService.saveEvents(event);
    ctx.response.body = {
      message: 'Event saved sucessfully',
    } as MessageResponse;
  } else {
    ctx.response.body = {
      error: 'Create new event failed: Validation Error',
    } as ErrorResponse;
  }
};

export const saveEventsCronHandler = async (ctx: Context) => {
  console.log('Server pinged');
  const token = ctx.request.headers.get('X-Daily-Token');

  // Change this to appropriate .env or github secret
  const expectedToken = Deno.env.get('DAILY_JOB_TOKEN');

  if (token !== expectedToken) {
    ctx.response.status = Status.Forbidden;
    ctx.response.body = { error: 'Forbidden' } as ErrorResponse;
    return;
  }

  console.log('Daily task triggered');

  const events = await generateEvents(
    ['music', 'charity', 'sports', 'other'],
    'Finsbury Park',
  );

  if (events !== null) {
    await eventService.saveEvents(events);
    ctx.response.body = {
      message: 'Events saved sucessfully',
    } as MessageResponse;
    console.log('Events saved');
  } else {
    ctx.response.status = Status.NoContent;
    ctx.response.body = { error: 'No events to save' } as ErrorResponse;
    console.log('There were no events to save');
  }
};
