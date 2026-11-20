'use client'

import { Plus } from "lucide-react";
import { useActionState } from "react"
import { createWorkspace } from "../lib/actions";

export default function NewWorkspace({variant = 'button'}: {variant?: 'button' | 'card'}) {
    const [state, formAction, isPending] = useActionState(createWorkspace, undefined);

    if(variant === 'card') {
        return (
            <form action={formAction} className="h-full">
                <button type="submit" disabled={isPending}
                    className="group flex h-full min-h-60 w-full flex-col items-center justify-center gap-3 rounded-box border-2 border-dashed border-base-300 text-base-content/60 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus-visible:outline-none disabled:cursor-wait">
                    <span className="grid size-12 place-items-center rounded-full bg-base-200 transition-colors group-hover:bg-accent/10">
                        {isPending ? <span className="loading loading-spinner loading-sm"/> : <Plus className="size-5"/>}
                    </span>
                    <span className="text-sm font-medium">{isPending ? 'Creating…' : state ? 'Couldn’t create — try again' : 'New document'}</span>
                </button>
            </form>
        )
    }

    return (
        <form action={formAction}>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
                {isPending ? <span className="loading loading-spinner loading-sm"/> : <Plus className="size-4"/>}
                {state ? 'Couldn’t create — try again' : 'New document'}
            </button>
        </form>
    )
}
