import { z } from '../../deps.ts'

export const eventSchema = z.object({
    mode: z.enum(['Music', 'Charity', 'Sports', 'Other']),
    name: z.string(),
    description: z.string(),
    location: z.string(),
    date: z.string(),
    price: z.number(),
    url: z.string()   
});

export const eventsArraySchema =  z.object({
    events: z.array(eventSchema)
})

export type event = z.infer<typeof eventsArraySchema>