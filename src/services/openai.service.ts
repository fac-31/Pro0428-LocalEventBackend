// Runs AI to console if comments are uncommented; deno run --allow-env --allow-net --allow-read --allow-write ./src./services./openai.service.ts

import {
  CompleteEventType,
  EventMode,
  eventsArraySchema,
  OpenAI,
  zodTextFormat,
} from '../../deps.ts';
import 'https://deno.land/std@0.224.0/dotenv/load.ts';

const AI_Key: string | undefined = Deno.env.get('AI_KEY');
if (!AI_Key) {
  throw new Error('AI_KEY environment variable not set.');
}

const clientAI: OpenAI = new OpenAI({
  apiKey: AI_Key,
});

export const generateEvents = async (
  category: EventMode[],
  location: string,
): Promise<CompleteEventType | null> => {
  console.log('Generating events');
  const catString: string = category.join(' ');

  const userPrompt: string =
    `Search for and list your top 75 interesting/fun/educational/charitable etc events within a 20km radius of ${location} (and don't be afraid to find the occasional obscure event!). Label each event as one of these categories to the best of your ability: ${catString}. Return only valid JSON in this format:
    {
        musicEvents: [
        {
            "mode": "Music",
            "name": "Jazz Night at The Park",
            "description": "An evening of smooth jazz at Finsbury Park Pavilion.",
            "location": "Finsbury Park Pavilion",
            "date": "2025-06-15T19:00:00.000Z",
            "price": 15,
            "distance": 10,
            "url": "https://example.com/jazz-night"
        },
        ...
        ],
        ...
    }`;

  const systemPrompt: string =
    `You are a local guide who is an expert on ${location} and all the interesting events in that area. You will respond
    with the specified events near this location in the valid format with the distance to the event provided in kilometers.`;

  try {
    const formatParser = zodTextFormat(
      eventsArraySchema,
      'events',
    ) as ReturnType<typeof zodTextFormat>;

    const response = await clientAI.responses.parse({
      model: 'gpt-4.1',
      instructions: systemPrompt,
      input: userPrompt,
      tools: [{
        type: 'web_search_preview',
        user_location: {
          type: 'approximate',
          country: 'GB',
          city: location,
        },
      }],
      text: {
        format: formatParser,
      },
    });

    const event = response.output_parsed as CompleteEventType;
    // console.log(event)
    return event;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`AI API call failed: ${error.message}`);
    } else {
      throw new Error('AI API call failed with an unknown error');
    }
  }
};

// generateEvents(['Music', 'Charity', 'Sports', 'Other'], "Finsbury Park");
