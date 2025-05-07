// deno-lint-ignore-file require-await
import { Context } from '../../deps.ts';
import { eventService } from '../services/event.service.ts';

export const getAllEvents = async (ctx: Context) => {
  const allEvents = await eventService.getAllEvents();
  ctx.response.body = allEvents;
};

export const getEvent = async (ctx: Context) => {
  // TODO: Get event by ID from ctx.params.id
  ctx.response.body = { message: `Get event using params.id` };
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
