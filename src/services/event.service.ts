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
  EventFilter,
  eventsArraySchema,
  eventSchema,
  FullEvent,
} from 'models/event.model.ts';
import { normaliseEvents } from '../utils/event.utils.ts';

const events = db.collection<FullEvent>('events');

const getAllEvents = async (filter: EventFilter): Promise<FullEvent[]> => {
  const mongoFilter: Record<string, unknown> = {};

  if (filter.mode && filter.mode.length > 0) {
    mongoFilter.mode = { $in: filter.mode };
  }

  return await events.find(mongoFilter).toArray();
};

const getEventById = async (id: string): Promise<FullEvent | null> => {
  return await events.findOne({ _id: new ObjectId(id) });
};

const updateEventById = async (id: string, event: Partial<FullEvent>) => {
  return await events.updateOne({ _id: new ObjectId(id) }, { $set: event });
};

const deleteEventById = async (id: string) => {
  return await events.deleteOne({ _id: new ObjectId(id) });
};

const databaseIncludes = async (event: FullEvent): Promise<boolean> => {
  const existingEvent = await events.findOne({ eventKey: event.eventKey });
  return existingEvent !== null;
};

export const isCompleteEventType = (obj: unknown): obj is CompleteEventType => {
  return eventsArraySchema.safeParse(obj).success;
};

export const isEvent = (obj: unknown): obj is Event => {
  return eventSchema.safeParse(obj).success;
};

const saveEvents = async (input: Event | CompleteEventType) => {
  if (isCompleteEventType(input)) {
    // Flatten all event categories into a single array
    const allEvents: Event[] = [
      ...input.musicEvents,
      ...input.charityEvents,
      ...input.sportEvents,
      ...input.otherEvents,
    ];

    const normalisedEvents = normaliseEvents(allEvents);

    for (const event of normalisedEvents) {
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
  } else {
    const normalisedEvent = normaliseEvents([input]);
    try {
      if (!(await databaseIncludes(normalisedEvent[0]))) {
        await events.insertOne(normalisedEvent[0]);
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
  updateEventById,
  deleteEventById,
  saveEvents,
  isEvent,
};
