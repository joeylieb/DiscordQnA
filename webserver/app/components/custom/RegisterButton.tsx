'use client';
import {Button} from "@/components/ui/button.tsx";
import {startRegistration} from "@simplewebauthn/browser";
import {useState} from "react";
import {redirect} from "next/navigation";

export default function RegisterButton({username, uid, dateCreated}:{username: string, uid: number, dateCreated: number}){
    const [success, setSuccess] = useState<boolean>(false);

    const onButtonClick = async () => {
        const options = await fetch("/api/webauthn/options?name=" + username);
        const optionsJSON = await options.json();
        console.log(optionsJSON)

        try {
            const attResp = await startRegistration({ optionsJSON: optionsJSON.data });
            const userObj = await fetch("/api/account/create", {
                method: "POST",
                body: JSON.stringify({username, uid, dateCreated, attResp}),
            });
            const result = await userObj.json();

            if(result.data.success){
                redirect("/?message=success");
            }
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <Button type="button" onClick={onButtonClick}>Continue</Button>
    )
}