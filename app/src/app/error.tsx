'use client'

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import Logo from "./components/logo";

export default function Error({reset}: {error: Error & {digest?: string}, reset: () => void}) {
    return (
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
            <Logo className="size-14"/>
            <h1 className="mt-6 font-serif text-5xl">Something went wrong</h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-base-content/60">
                We hit a snag loading this page. Your documents are safe. Try again in a moment.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button type="button" className="btn btn-primary" onClick={reset}>
                    <RefreshCw className="size-4"/>
                    Try again
                </button>
                <Link href="/dashboard" className="btn btn-ghost">Go to dashboard</Link>
            </div>
        </main>
    )
}
