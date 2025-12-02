import React from "react";
import {redirect} from "next/navigation";
import {getUserFromSession} from "@src/utils/auth.ts";

export default async function RootLayout({children,}: {
    children: React.ReactNode
}) {
    const userObj = await getUserFromSession();
    if(!userObj) return redirect("/")

    return (
        <body className="bg-slate-900">{children}</body>
    )
}