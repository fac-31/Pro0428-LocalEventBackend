import { Event } from "https://raw.githubusercontent.com/fac-31/Pro0428-LocalEventShared/main/src/models/event.model.ts";

export const realData: Array<Event> = [
  {
    'mode': 'other',
    'name': 'Event Header',
    'description':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec congue eros, scelerisque vestibulum ante.',
    'location': 'Finsbury Park',
    'date': '2025-06-04T23:00:00.000Z',
    'price': 1000,
    'url': 'https://www.greatevent.com',
    'distance': 37.85,
  },
  {
    'mode': 'music',
    'name': 'Wireless Festival 2025',
    'description':
      'A three-day music festival featuring Drake headlining all three days, with special guests including PARTYNEXTDOOR, Summer Walker, Burna Boy, and Vybz Kartel.',
    'location': 'Finsbury Park, London',
    'date': '2025-07-11T12:00:00.000Z',
    'price': 0,
    'url': 'https://www.timeout.com/london/music/wireless-2',
    'distance': 10.23,
  },
  {
    'mode': 'music',
    'name': 'Fontaines D.C. Live at Finsbury Park',
    'description':
      'An open-air concert featuring Fontaines D.C., Amyl and The Sniffers, and Kneecap.',
    'location': 'Finsbury Park, London',
    'date': '2025-07-05T12:30:00.000Z',
    'price': 54.5,
    'url':
      'https://www.chooseyourevent.co.uk/event/293905/finsbury-park-fontaines-d-c-2025',
    'distance': 65.91,
  },
];
