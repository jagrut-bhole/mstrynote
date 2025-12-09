import { z } from 'zod';

export const messageSchema = z.object({
    context : z
                .string()
                .min(10 ,{message : "Message must be at least 10 characters."})
                .max(300,{message : "Message cannot exceed 300 characters."})
})