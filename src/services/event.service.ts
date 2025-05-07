// getAllEvents - DONE
// getEventById
// createEvents
// updateEvent
// deleteEvent

import { db } from '../database/connect.ts';
import { Event } from '../models/event.model.ts';

const events = db.collection<Event>('events');

const getAllEvents = async (): Promise<Event[]> => {
  return await events.find().toArray();
};

export const eventService = {
  getAllEvents,
};
