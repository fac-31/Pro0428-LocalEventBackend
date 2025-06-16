import { eventService } from './services/event.service.ts';
import { generateEvents } from './services/openai.service.ts';

Deno.cron('save events cron', "0 0 * * *", async () => {
  console.log('executing cron job...');
  try {
    console.log('Daily task triggered');

    const events = await generateEvents(
      ['music', 'charity', 'sports', 'other'],
      'Finsbury Park',
    );

    if (events !== null) {
      await eventService.saveEvents(events);
      console.log('Events saved successfully');
    } else {
      console.log('There were no events to save');
    }
  } catch (error) {
    console.error('Cron job failed:', error);
  }
});

//cron for every 10mins
// "*/3 * * * *"

// cron for midnight
// "0 0 * * *"
