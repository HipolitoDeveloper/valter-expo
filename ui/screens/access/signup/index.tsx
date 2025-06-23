import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "expo-router";
import {useForm} from "react-hook-form";
import HttpError from "../../../../common/errors/http-error";
import {useSession} from "../../../../hooks/use-session";
import {login, register} from "../../../../services/auth";

import SignupPresentational from "./presentational";
import {SignUpFormSchema, SignUpFormSchemaType} from "./schema";

const SignUp = () => {
    const {control, handleSubmit} = useForm<SignUpFormSchemaType>({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            "email": "manchester@gmail.com",
            "firstName": "User manchester",
            "surname": "manchester apagar",
            "birthday": "2001-01-21 22:44:29.728 -0300",
            "pantryName": "Pantry name",
            "password": "teste"
        }
    });
    const {signIn} = useSession()
    const router = useRouter();

    const doSignUp = async (formData: SignUpFormSchemaType) => {

        try {
            const accessData = await register({
                firstName: formData.firstName,
                surname: formData.surname,
                birthday: formData.birthday,
                pantryName: formData.pantryName,
                email: formData.email,
                password: formData.password
            })

            await signIn({
                accessToken: accessData.accessToken,
                refreshToken: accessData.refreshToken
            })


        } catch (error) {
            if (error instanceof HttpError) {
                console.log("doSignUp Error", error)
            } else {
                console.log("doSignUp Error", error)
            }
        }
    }

    return (
        <SignupPresentational
            control={control}
            handleSubmit={handleSubmit(doSignUp)}
        />

    )
}

export default SignUp;