export type EventMode = 'Music' | 'Charity' | 'Sports' | 'Other';

export interface Event {
  mode: EventMode;
  name: string;
  description: string;
  location: string;
  date: Date;
  price: number;
  url: string;
}
// This can be removed and then in event.schema we can infer type from the event schema