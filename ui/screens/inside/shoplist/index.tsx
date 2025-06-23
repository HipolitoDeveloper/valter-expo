import HttpError from "../../../../common/errors/http-error";
import {useSession} from "../../../../hooks/use-session";
import {login, logout} from "../../../../services/auth";
import {SignInFormSchemaType} from "../../access/signin/schema";
import ShoplistPresentational from "./presentational";

const Shoplist = () => {

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
        <ShoplistPresentational doSomething={doSomething}/>
    )
}

export default Shoplist;