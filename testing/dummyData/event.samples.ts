import { Event } from '../../src/models/event.model.ts';

// Test event examples
export const testEvents: Event[] = [
  {
    mode: 'Music',
    name: 'Finsbury Park Festival 2025',
    description: 'Annual music festival in the park',
    location: 'Finsbury Park',
    date: '2025-06-15T19:00:00.000Z',
    price: 25,
    url: 'https://example.com/festival',
  },
  {
    mode: 'Music',
    name: 'Finsbury Park Festival',
    description: 'Music festival in the park',
    location: 'Finsbury Park',
    date: '2025-06-15T19:00:00.000Z',
    price: 25,
    url: 'https://example.com/festival',
  },
  {
    mode: 'Music',
    name: 'FINSBURY PARK FESTIVAL - 2025 Edition',
    description: 'The biggest festival in Finsbury Park',
    location: 'Finsbury Park',
    date: '2025-06-15T19:00:00.000Z',
    price: 25,
    url: 'https://example.com/festival',
  },
  {
    mode: 'Music',
    name: 'Jazz in the Park - June 15th',
    description: 'Jazz concert in the park',
    location: 'Finsbury Park',
    date: '2025-06-15T19:00:00.000Z',
    price: 15,
    url: 'https://example.com/jazz',
  },
  {
    mode: 'Sports',
    name: 'Finsbury Marathon 2025',
    description: 'Annual marathon through Finsbury',
    location: 'Finsbury Park',
    date: '2025-07-10T08:00:00.000Z',
    price: 30,
    url: 'https://example.com/marathon',
  },
];
