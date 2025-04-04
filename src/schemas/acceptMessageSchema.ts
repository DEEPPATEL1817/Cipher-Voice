import {z} from 'zod'

export const acceptMessageSchema = z.object({
    aceeptMessages: z.boolean(),
})