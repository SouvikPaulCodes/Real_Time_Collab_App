'use client'

import { CirclePlus } from "lucide-react";
import { useActionState } from "react"
import { createWorkspace } from "../lib/actions";

export default function NewWorkppace() {
    const [state, formAction, isPending] = useActionState(createWorkspace, undefined);

    return (
        <form action={formAction}>
            <button type="submit" className="btn" disabled={isPending}>
                {isPending ? <span className="loading loading-spinner loading-xl"></span>
                : <CirclePlus width={50} height={50} />}              
            </button>
        </form>
    )
}