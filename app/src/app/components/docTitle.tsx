'use client'

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, CircleAlert, LoaderCircle } from "lucide-react";
import { updateTitle } from "../lib/actions";

export default function DocTitle({id, name}: {id: string, name: string | undefined}) {
    // `title` is what the database has; `draft` is what's in the input.
    const [title, setTitle] = useState(name ?? '');
    const [draft, setDraft] = useState(name ?? '');
    const [justSaved, setJustSaved] = useState(false);

    const [state, formAction, isPending] = useActionState(updateTitle, undefined);

    const formRef = useRef<HTMLFormElement>(null);
    const cancelled = useRef(false);

    useEffect(() => {
        if(isPending) return;

        if(state) {
            setTitle(draft);
            setJustSaved(true);

            const timer = setTimeout(() => setJustSaved(false), 2000);
            return () => clearTimeout(timer);
        }
        else if(state === false) setDraft(title);
    }, [state, isPending])

    const dirty = draft !== title;

    return (
        <form ref={formRef} action={formAction} className="flex min-w-0 items-center gap-3">
            <input type="hidden" name='id' value={id}/>
            <input type="text" name='title' required readOnly={isPending} value={draft} placeholder="Untitled document" aria-label="Document title"
                className="max-w-full min-w-[6ch] truncate rounded-field bg-transparent px-2 py-0.5 font-serif text-2xl leading-tight outline-none field-sizing-content placeholder:text-base-content/35 hover:bg-base-200 focus:bg-base-200 sm:text-3xl"
                onChange={(e) => setDraft(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if(e.key === 'Escape') {
                        cancelled.current = true;
                        setDraft(title);
                        e.currentTarget.blur();
                    }
                }}
                onBlur={() => {
                    if(isPending) return;

                    if(cancelled.current) {
                        cancelled.current = false;
                        return;
                    }

                    if(!draft.trim()) setDraft(title);
                    else if(dirty) formRef.current?.requestSubmit();
                }}/>

            <span className="shrink-0 text-xs" aria-live="polite">
                {isPending ?
                    <span className="flex items-center gap-1 opacity-60"><LoaderCircle className="size-3.5 animate-spin"/>Saving</span>
                : dirty ?
                    <span className="opacity-50">Enter to save</span>
                : state === false ?
                    <span className="flex items-center gap-1 text-error"><CircleAlert className="size-3.5"/>Couldn't rename</span>
                : justSaved ?
                    <span className="flex items-center gap-1 text-success"><Check className="size-3.5"/>Saved</span>
                : null}
            </span>
        </form>
    )
}
