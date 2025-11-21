import RegisterField from "@/components/custom/RegisterField.tsx";
import "../../src/utils/envConfig.ts"

export default function App() {
    return (
        <div>
            <RegisterField url={process.env.WEBSOCKET!}/>
        </div>
    )
}