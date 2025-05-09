// getAllEvents - DONE
// getEventById - DONE
// createEvents
// updateEvent
// deleteEvent

import { ObjectId } from '../../deps.ts';
import { db } from '../database/connect.ts';
import { Event } from '../models/event.model.ts';

const events = db.collection<Event>('events');

const getAllEvents = async (): Promise<Event[]> => {
  return await events.find().toArray();
};

const getEventById = async (id: string): Promise<Event> => {
  return await events.findOne({ _id: new ObjectId(id) });
};

export const eventService = {
  getAllEvents,
  getEventById,
};
