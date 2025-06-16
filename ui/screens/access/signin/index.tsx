import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import HttpError from "../../../../common/errors/http-error";
import {useProfile} from "../../../../hooks/use-profile";
import {useSession} from "../../../../hooks/use-session";
import {login} from "../../../../services/auth";

import SigninPresentational from "./presentational";
import {SignInFormSchema, SignInFormSchemaType} from "./schema";

const SignIn = () => {
    const {control, handleSubmit} = useForm<SignInFormSchemaType>({
        resolver: zodResolver(SignInFormSchema),
        defaultValues: {
            "email": "admin@valter.com",
            "password": "teste"
        }
    });
    const {signIn} = useSession()
    const {profile} = useProfile()

    const doSignIn = async (formData: SignInFormSchemaType) => {

        try {
           const accessData=  await login({
                email: formData.email,
                password: formData.password
            })

            await signIn({
                accessToken: accessData.accessToken,
                refreshToken: accessData.refreshToken
            })

        } catch(error) {
            if(error instanceof HttpError) {
                console.log("doSignIn Error", error)
            } else {
                console.log("doSignIn Error", error)
            }
        }
    }

    return (
        <SigninPresentational
            control={control}
            handleSubmit={handleSubmit(doSignIn)}
        />

    )
}

export default SignIn;