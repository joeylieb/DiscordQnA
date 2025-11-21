import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils.ts"

function Switch({
                    className,
                    ...props
                }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={cn(
                "peer inline-flex h-[18px] w-[34px] shrink-0 cursor-pointer items-center rounded-full border border-gray-300 bg-gray-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:border-gray-600 dark:bg-gray-700 data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-600",
                className
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={cn(
                    "pointer-events-none block h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 dark:bg-gray-200"
                )}
            />
        </SwitchPrimitive.Root>
    )
}


export { Switch }
