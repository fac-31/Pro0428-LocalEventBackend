// interacts with openAi
// generateEventsfromPrompt
import { OpenAI } from 'jsr:@openai/openai';
import { eventsArraySchema, eventSchema, event } from '../models/event.schema.ts';

const AI_Key = Deno.env.get('AI_KEY')
if (!AI_Key) {
    throw new Error('AI_KEY environment variable not set.');
  }

const clientAI = new OpenAI({
    apiKey: AI_Key
})

export const generateEvents = async (category: string, location: string): Promise<event> => {

}