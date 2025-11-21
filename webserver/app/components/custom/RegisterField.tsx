'use client';
import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "../ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {useEffect, useRef, useState} from "react";
import {usernameGenerator} from "@src/utils/username.ts";
import {Label} from "@/components/ui/label.tsx";
import RegisterButton from "@/components/custom/RegisterButton.tsx";
import {useRouter} from "next/navigation";

export default function RegisterField({ url }: {url: string}) {
    const [wsStatus, setWsStatus] = useState<{active: boolean, lastMessage: number | null}>({active: false, lastMessage: null});
    const [debugMode, setDebugMode] = useState<boolean>(false);
    const [yourUID, setYourUID] = useState<number | null>(null);
    const [userObj, setUsername] = useState<{ username: string, date: number } | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const router = useRouter();

    useEffect(() => {
        const ws = new WebSocket(url);
        socketRef.current = ws;

        ws.onmessage = (message: MessageEvent) => {
            const parsedMessage = JSON.parse(message.data);
            console.log(parsedMessage)
            switch (parsedMessage.op) {
                case 1:
                    if(typeof parsedMessage.d !== "number") break;
                    setTimeout(() => {
                        ws.send(JSON.stringify({op: 1}))
                    }, parsedMessage.d)
                    break;
                case 5:
                    if(typeof parsedMessage.d !== "number") {
                        console.log("Not a number")
                        break;
                    }
                    setYourUID(parsedMessage.d + 1)
                    setUsername(usernameGenerator(yourUID! + 1))
            }
        }

        ws.onopen = () => {
            setWsStatus(prevState => ({active: true, lastMessage: prevState?.lastMessage}));
        }

        ws.onclose = () => {
            setWsStatus(prevState => ({active: false, lastMessage: prevState?.lastMessage}))
        }

        return () => {
            console.log("Websocket Died lol")
            setWsStatus({active: false, lastMessage: null})
            ws.close()
        }
    }, []);

    useEffect(() => {
        if(!wsStatus.active) router.push("/register");
    }, [wsStatus]);

    const onDebugMode = () => {
        setDebugMode(v => !v);
        console.log(JSON.stringify({op:3, d: !debugMode}));
        socketRef.current?.send(JSON.stringify({op:3, d: !debugMode}))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0E1525] p-6 animate-fadeIn">
            <div className="w-full max-w-md mx-auto p-6">
                <form>
                    <FieldGroup className="bg-white/95 rounded-2xl shadow-xl p-8 border border-white/20 backdrop-blur-md w-[420px] space-y-6 transition-all hover:shadow-2xl hover:border-white/30">
                        <FieldSet>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Register for AskThem</h2>
                            <div className="flex flex-row gap-2">
                                <Switch id="debug-mode" onCheckedChange={onDebugMode} className="" />
                                <Label htmlFor="debug-mode" className="text-sm text-gray-700 font-medium">Debug Mode</Label>
                            </div>
                            <FieldGroup className="space-y-4">
                                <Field>
                                    <FieldLabel className="text-sm font-medium text-gray-700">Your UID</FieldLabel>
                                    <Input disabled placeholder={yourUID ? (yourUID).toString() : `N/A`} className="bg-gray-100/50 text-gray-600 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400"/>
                                </Field>
                                {yourUID && (
                                    <Field>
                                        <FieldLabel className="text-sm font-medium text-gray-700">
                                            Your username will be {" "}<strong className="text-gray-900">{userObj!.username}</strong>
                                        </FieldLabel>
                                    </Field>
                                )}
                                {userObj && (
                                    <Field>
                                        <RegisterButton username={userObj.username} uid={yourUID!} dateCreated={userObj.date}/>
                                    </Field>
                                )}
                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </form>

            </div>
        </div>
    )
}