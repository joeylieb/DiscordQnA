import {NextRequest, NextResponse} from "next/server";
import {User} from "@src/schema/user.ts";
import {dbConnect} from "@src/utils/db.ts";

export async function GET(req: NextRequest){
    await dbConnect()
    const memberCount = await User.estimatedDocumentCount();
    return NextResponse.json({amount: memberCount}, {status: 200});
}