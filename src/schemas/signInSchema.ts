import {z} from 'zod'

export const signInSchema = z.object({
    //identifier or email or username we can use any name 
    identifier: z.string(),
    password : z.string()
})