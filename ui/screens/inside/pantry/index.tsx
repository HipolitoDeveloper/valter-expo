import HttpError from "../../../../common/errors/http-error";
import {useSession} from "../../../../hooks/use-session";
import {logout} from "../../../../services/auth";
import PantryPresentational from "./presentational";

const Pantry = () => {

    const {signOut} = useSession();

    const doSomething = async () => {
        try {
            await logout()

            await signOut()


        } catch (error) {
            if (error instanceof HttpError) {
                console.log("doLogout Error", error)
            } else {
                console.log("doLogout Error", error)
            }
        }
    }
    return (
        <PantryPresentational doSomething={doSomething}/>
    )
}

export default Pantry;