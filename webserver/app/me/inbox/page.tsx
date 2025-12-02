import {getUserFromSession} from "@src/utils/auth.ts";
import {redirect} from "next/navigation";


export default async function Page(){
    const userObj = await getUserFromSession();
    if(!userObj) redirect(`/`);

    return (
        <div>
            <p>Wassup {userObj.username} how is it going</p>
        </div>
    )
}