import RegisterField from "@/components/custom/RegisterField.tsx";
import "../../src/utils/envConfig.ts"

export default function App() {
    console.log(process.env.WEBSOCKET);
    return (
        <div>
            <RegisterField url={process.env.WEBSOCKET!}/>
        </div>
    )
}