import { saveEvents } from './save.events.ts';
import { generateEvents } from '../services/openai.service.ts';


// This file is useless until deployment. Have fun. 

Deno.serve(async (req: Request) => {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    // Change this to appropriate .env or github secret
    const expectedToken = Deno.env.get("DAILY_JOB_TOKEN");

    if (token !== expectedToken) {
        return new Response("Forbidden", {status: 403});
    };
    
    console.log("Secure daily task triggered");

    const events = await generateEvents(["Music", 'Charity', 'Sports', 'Other'], "Finsbury Park");

    if (events !== null) {

    await saveEvents(events);

    console.log("Events saved");
    } else {

        console.log("Cannot save events. Events equalled null")
    }

    return new Response("Daily task completed");
})