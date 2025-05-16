import { eventService } from '../services/event.service.ts';
import { generateEvents } from '../services/openai.service.ts';
import { Status } from '../../deps.ts';

Deno.serve(async (req: Request) => {
  console.log("Server pinged")
  const token = req.headers.get('X-Daily-Token');

  // Change this to appropriate .env or github secret
  const expectedToken = Deno.env.get('DAILY_JOB_TOKEN');

  if (token !== expectedToken) {
    return new Response('Forbidden', { status: Status.Forbidden });
  }

  console.log('Daily task triggered');

  const events = await generateEvents(
    ['Music', 'Charity', 'Sports', 'Other'],
    'Finsbury Park',
  );

  if (events !== null) {
    await eventService.saveEvents(events);

    console.log('Events saved');
  } else {
    // We could implement a delete out of date event function around here
    console.log('Cannot save events; events was null');
  }

  return new Response('Daily task completed');
});
