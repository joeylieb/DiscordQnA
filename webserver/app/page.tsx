'use client';
import {Button} from "./components/ui/button.tsx";

export default function Page() {


    const onClick = async() => {
        const data = await fetch("/api/webauth/");
        const auth = await data.json();
        console.log(auth);
    }

    return (
        <div className="bg-[#272932]">
            <h1 className="text-4xl">AskThem</h1>
            <p>Curiosity is finally meeting anonymity</p>
            <Button onClick={onClick}>Continue</Button>
            <a className="italic" href="/register">First time?</a>
        </div>
    )
}