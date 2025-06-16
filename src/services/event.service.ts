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
} from 'https://raw.githubusercontent.com/fac-31/Pro0428-LocalEventShared/main/src/models/event.model.ts';
import { normaliseEvents, detectDuplicates } from '../utils/event.utils.ts';

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

const checkForDuplicates = async (event: FullEvent): Promise<FullEvent[]> => {
  // Get all existing events from database
  const allExistingEvents = await events.find({}).toArray();
  
  // Use fuzzy matching to detect duplicates
  const duplicates = detectDuplicates(event, allExistingEvents, 0.6);
  
  return duplicates;
};

export const isCompleteEventType = (obj: unknown): obj is CompleteEventType => {
  return eventsArraySchema.safeParse(obj).success;
};

export const isEvent = (obj: unknown): obj is Event => {
  return eventSchema.safeParse(obj).success;
};

const saveEvents = async (input: Event | CompleteEventType) => {
  console.log("Calling saveEvents()...")
  if (isCompleteEventType(input)) {
    // Flatten all event categories into a single array
    const allEvents: Event[] = [
      ...input.musicEvents,
      ...input.charityEvents,
      ...input.sportEvents,
      ...input.otherEvents,
    ];

    const normalisedEvents = normaliseEvents(allEvents);
    console.log("Event title normalised...")

    for (const event of normalisedEvents) {
      try {
        const duplicates = await checkForDuplicates(event);
        if (duplicates.length === 0) {
          await events.insertOne(event);
          console.log(`New event saved: ${event.name}`);
        } else {
          console.log(`Event duplicate detected: ${event.name} - Found ${duplicates.length} similar event(s)`);
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
      const duplicates = await checkForDuplicates(normalisedEvent[0]);
      if (duplicates.length === 0) {
        await events.insertOne(normalisedEvent[0]);
        console.log(`New event saved: ${normalisedEvent[0].name}`);
      } else {
        console.log(`Event duplicate detected: ${normalisedEvent[0].name} - Found ${duplicates.length} similar event(s)`);
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
