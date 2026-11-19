import Link from "next/link";
import Logo from "./components/logo";

export default function NotFound() {
    return (
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
            <Logo className="size-14"/>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-base-content/50">404</p>
            <h1 className="mt-2 font-serif text-5xl">This page is blank</h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-base-content/60">
                The page you&apos;re looking for doesn&apos;t exist, or we couldn&apos;t load it right now.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/dashboard" className="btn btn-primary">Go to dashboard</Link>
                <Link href="/" className="btn btn-ghost">Home</Link>
            </div>
        </main>
    )
}
