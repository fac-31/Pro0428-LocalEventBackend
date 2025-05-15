import { saveEvents } from './save.events.ts';
import { generateEvents } from '../services/openai.service.ts';
import { Status } from '../../deps.ts';

// This file is useless until deployment. Have fun.

Deno.serve(async (req: Request) => {
  const token = req.headers.get("X-Daily-Token");

  // Change this to appropriate .env or github secret
  const expectedToken = Deno.env.get('DAILY_JOB_TOKEN');

  if (token !== expectedToken) {
    return new Response("Forbidden", {status: Status.Forbidden} );
  }

  console.log('Daily task triggered');

  const events = await generateEvents(
    ['Music', 'Charity', 'Sports', 'Other'],
    'Finsbury Park',
  );

  if (events !== null) {
    await saveEvents(events);

    console.log('Events saved');
  } else {
    // We could implement a delete out of date event function around here 
    console.log('Cannot save events; events was null');
  }

  return new Response('Daily task completed');
});
