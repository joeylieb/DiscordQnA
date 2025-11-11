'use client';
import {FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field";

//TODO: Show live count of people registered as their UI

export default function RegisterField() {
    return (
        <FieldSet>
            <FieldLegend>Register for AskThem</FieldLegend>
            <FieldDescription>Please Fill Out the Info Accordingly</FieldDescription>
            <FieldGroup>
                <FieldLabel>Your ID</FieldLabel>
        </FieldGroup>
        </FieldSet>
    )
}