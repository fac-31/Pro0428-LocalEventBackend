import { z } from '../../deps.ts';

export const eventSchema = z.object({
    mode: z.enum(['Music', 'Charity', 'Sports', 'Other']),
    name: z.string().min(1),
    description: z.string().min(10),
    location: z.string().min(1),
    date: z.coerce.date(),
    price: z.number().nonnegative(),
    url: z.string().url()    
});

export const eventsArraySchema = z.array(eventSchema);

export type event = z.infer<typeof eventsArraySchema>