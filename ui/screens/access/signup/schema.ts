import {z} from "zod";

export const SignUpFormSchema = z.object({
    firstName: z.string({message: 'Nome is required'}),
    surname: z.string({message: 'Sobrenome is required'}),
    birthday: z.string({message: 'Data de nascimento is required'}),
    email: z.string({message: 'E-mail is required'}),
    password: z.string({message: 'Password is required'}),
    confirmPassword: z.string({message: 'Confirmação de senha é obrigatória'}),
    pantryName: z.string({message: 'Nome da Despensa is required'}),

})
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    });

export type SignUpFormSchemaType = z.infer<typeof SignUpFormSchema>;