import {cookies} from "next/headers";
import {Session} from "@src/schema/session";
import {IUser, User} from "@src/schema/user";
import {dbConnect} from "@src/utils/db.ts";

export async function getUserFromSession(): Promise<IUser | null> {
    await dbConnect();
    const cookieData = await cookies();
    const session = cookieData.get("sessionID");
    if(!session) return null;

    const dbSession = await Session.findOne({ sessionID: session.value });
    if(!dbSession) return null;

    return User.findOne({username: dbSession.userID});
}
