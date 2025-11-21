import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {Session} from "@src/schema/session.ts";
import {IUser, User} from "@src/schema/user.ts";

export default async function Page(){
    const cookieData = await cookies();
    const session = cookieData.get("sessionID");
    if(!cookieData.has("sessionID")) return redirect("/")

    const dbSession = await Session.findOne({sessionID: session!.value})
    if(!dbSession) return redirect("/")
    const userObj: IUser | null = await User.findOne({username: dbSession.userID});
    if(!userObj) return redirect("/")

    return (
        <div>
            <p>Wassup {userObj.username} how is it going</p>
            <p>67 67 67 67 67 67 67 67 67 67</p>
        </div>
    )
}