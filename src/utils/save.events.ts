import { CompleteEventType, Event } from '../models/event.model.ts';

import { db } from '../database/connect.ts';

const eventCollection = db.collection<Event>('events');

const databaseIncludes = async (event: Event): Promise<boolean> => {
  const exists = await eventCollection.findOne({
    name: event.name,
    date: event.date,
    location: event.location,
  });
  return exists !== null;
};

const isCompleteEventType = (obj: unknown): obj is CompleteEventType => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.values(obj).every((val) => Array.isArray(val))
  );
};

export const saveEvents = async (input: Event | CompleteEventType) => {
  if (isCompleteEventType(input)) {
    for (const eventCategory of Object.values(input)) {
      for (const event of eventCategory) {
        if (!(await databaseIncludes(event))) {
          await eventCollection.insertOne(event);
        }
      }
    }
  } else {
    if (!(await databaseIncludes(input))) {
      await eventCollection.insertOne(input);
    }
  }
};
