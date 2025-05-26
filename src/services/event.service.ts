// getAllEvents - DONE
// getEventById - DONE
// createEvents
// updateEvent
// deleteEvent

import { ObjectId } from '../../deps.ts';
import { db } from '../database/connect.ts';
import {
  CompleteEventType,
  Event,
  eventsArraySchema,
  eventSchema,
} from '../models/event.model.ts';
import { normalizeEventTitle, normalizeEventDate } from '../utils/event.utils.ts';

const events = db.collection<Event>('events');
//console.log(events);

const getAllEvents = async (): Promise<Event[]> => {
  return await events.find().toArray();
};

const getEventById = async (id: string): Promise<Event | null> => {
  return await events.findOne({ _id: new ObjectId(id) });
};

const databaseIncludes = async (event: Event): Promise<boolean> => {
  const name = normalizeEventTitle(event);
  const date = normalizeEventDate(event);

  try {
    const exists = await events.findOne({
      name: name,
      date: date,
      location: event.location,
    });

    return exists !== null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Event in Db check failed: ${error.message}`);
    } else {
      throw new Error('Event in Db check failed with an unknown error');
    }
  }
};

export const isCompleteEventType = (obj: unknown): obj is CompleteEventType => {
  return eventsArraySchema.safeParse(obj).success;
};

export const isEvent = (obj: unknown): obj is Event => {
  return eventSchema.safeParse(obj).success;
};

const saveEvents = async (input: Event | CompleteEventType) => {
  if (isCompleteEventType(input)) {
    for (const eventCategory of Object.values(input)) {
      for (const event of eventCategory) {
        try {
          if (!(await databaseIncludes(event))) {
            await events.insertOne(event);
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error(
              `Event save failed: ${JSON.stringify(event)}, ${error.message}`,
            );
          } else {
            console.error('Event save failed with an unknown error');
          }
        }
      }
    }
  } else {
    try {
      if (!(await databaseIncludes(input))) {
        await events.insertOne(input);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Event save failed: ${JSON.stringify(input)}, ${error.message}`,
        );
      } else {
        console.error('Event save failed with an unknown error');
      }
    }
  }
};

export const eventService = {
  getAllEvents,
  getEventById,
  saveEvents,
  isEvent,
};
