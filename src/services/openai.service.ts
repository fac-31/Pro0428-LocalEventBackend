// interacts with openAi
// generateEventsfromPrompt
import { eventsArraySchema, eventSchema, event } from '../models/event.schema.ts';
import { OpenAI, zodResponseFormat, z } from '../../deps.ts';
import 'https://deno.land/std@0.224.0/dotenv/load.ts';

const AI_Key = Deno.env.get('AI_KEY');
if (!AI_Key) {
    throw new Error('AI_KEY environment variable not set.');
  };

const clientAI = new OpenAI({
    apiKey: AI_Key
});

export const generateEvents = async (category: string, location: string): Promise<string | null | void> => {
    
    const userPrompt: string = `List 5 ${category} events near ${location}. Return only valid JSON in this format:
    [
    {
        "mode": "${category}",
        "name": "Jazz Night at The Park",
        "description": "An evening of smooth jazz at Finsbury Park Pavilion.",
        "location": "Finsbury Park Pavilion",
        "date": "2025-06-15T19:00:00.000Z",
        "price": 15,
        "url": "https://example.com/jazz-night"
    },
    ...
    ]`

    const systemPrompt = `You are a local guide who is an expert on ${location} and all the interesting events in that area. You will respond
    with the specified events near this location in the valid format.`
    
    try {
        const response = await clientAI.chat.completions.create({
            model: "gpt-4o-search-preview",
            web_search_options: {
                search_context_size: "medium",
                user_location: {
                    type: "approximate",
                    approximate: {
                        country: "GB",
                        city: location,
                    }
                },
            },
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: userPrompt},
            ],
            response_format: zodResponseFormat(eventsArraySchema, "events")
        });
        console.log(response.choices[0].message.content)
        return response.choices[0].message.content;
    } catch (error) {
        return console.log(error)    
    }
}

generateEvents("Music", "Finsbury Park");