'use client';
import {Button} from "./components/ui/button.tsx";
import {startAuthentication} from "@simplewebauthn/browser";
import {redirect} from "next/navigation";

export default function Page() {
    const onClick = async() => {
        const data = await fetch("/api/webauthn/auth-options");
        const auth = await data.json();

        let asseResp;
        try {
            asseResp = await startAuthentication({ optionsJSON: auth.data })
        } catch (error) {
            console.log(error);
        }

        const authRaw = await fetch("/api/webauthn/verification", {
            method: "POST",
            body: JSON.stringify(asseResp),

        });
        const authRes = await authRaw.json();
        if(authRes.success) redirect("/inbox")
    }

    return (
        <div className="min-h-screen bg-[#0E1525] flex items-center justify-center p-8">
            <div className="text-center space-y-6">
                <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                    AskThem
                </h1>

                <p className="text-lg text-gray-300 max-w-sm mx-auto">
                    Curiosity finally meets <span className="text-white font-semibold">anonymity.</span>
                </p>

                <div className="space-y-3">
                    <Button
                        onClick={onClick}
                        className="px-6 py-3 text-base font-medium rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all"
                    >
                        Log in with Passkey
                    </Button>

                    <a
                        href="/register"
                        className="block text-sm italic text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        First time?
                    </a>
                </div>
            </div>

        </div>
    )
}