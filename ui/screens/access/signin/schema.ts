import {z} from "zod";

export const SignInFormSchema = z.object({
    email: z.string({message: 'E-mail is required'}),
    password: z.string({message: 'Password is required'}),
})

export type SignInFormSchemaType = z.infer<typeof SignInFormSchema>;