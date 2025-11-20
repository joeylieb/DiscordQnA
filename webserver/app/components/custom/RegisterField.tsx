'use client';
import {Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "../ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useEffect, useRef, useState} from "react";
import {Toggle} from "@/components/ui/toggle.tsx";

//TODO: Show live count of people registered as their UI

export default function RegisterField({ url }: {url: string}) {
    const [wsStatus, setWsStatus] = useState<{active: boolean, lastMessage: number | null}>({active: false, lastMessage: null});
    const [debugMode, setDebugMode] = useState<boolean>(false);
    const socketRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket(url);
        socketRef.current = ws;

        ws.onmessage = (message: MessageEvent) => {
            const parsedMessage = JSON.parse(message.data);
            console.log(parsedMessage)
            switch (parsedMessage.op) {
                case 1:
                    setTimeout(() => {
                        ws.send(JSON.stringify({op: 1}))
                    }, parsedMessage.d)
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

    const onDebugMode = () => {
        setDebugMode(v => !v);
        console.log(socketRef.current?.readyState)
        socketRef.current?.send(JSON.stringify({op:3, d: debugMode}))
    }

    return (
        <div className="flex">
            <FieldSet>
                <FieldLegend>Register for AskThem</FieldLegend>
                <FieldDescription>Please Fill Out the Info Accordingly</FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Debug Mode</FieldLabel>
                        <Toggle
                            aria-label="Toggle Debug Mode"
                            size="lg"
                            variant="outline"
                            className="data-[state=on]:bg-gray-500 transition-all duration-150 hover:bg-blue-50"
                            onClick={() => onDebugMode()}
                        >
                            <span className="font-medium tracking-wide">Debug Mode</span>
                        </Toggle>
                    </Field>
                    <Field>
                        <FieldLabel>Your UID</FieldLabel>
                        <Input disabled={true}/>
                        <p>{wsStatus?.active ? `The websocket is open!` : `The websocket is closed!`}</p>
                        <p>{debugMode ? `Debug mode is on` : `Debug mode is off`}</p>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </div>
    )
}