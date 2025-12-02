'use client';
import {Button} from "@/components/ui/button.tsx";
import {startRegistration} from "@simplewebauthn/browser";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function RegisterButton(){
    const router = useRouter()

    const onButtonClick = async () => {
        const options = await fetch("/api/webauthn/options");
        if(options.status === 500){
            // Alert, error
            console.log(await options.text());
            return;
        }
        const optionsJSON = await options.json();

        try {
            const attResp = await startRegistration({ optionsJSON: optionsJSON.data });
            const userObj = await fetch("/api/account/create", {
                method: "POST",
                body: JSON.stringify({attResp}),
                headers: {"Content-Type": "application/json"}
            });
            const result = await userObj.json();
            if(result.success){
                router.push("/?message=success");
            }
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <Button type="button" onClick={onButtonClick} className="mt-4 w-full py-3 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all duration-150 ease-out hover:shadow-blue-600/30 hover:scale-[1.02]">Continue</Button>
    )
}