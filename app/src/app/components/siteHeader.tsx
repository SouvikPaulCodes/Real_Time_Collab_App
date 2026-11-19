import Link from "next/link";
import Logo from "./logo";
import ThemeToggle from "./themeToggle";
import ClerkUI from "./clerkUI";

export default function SiteHeader() {
    return (
        <header className="h-16 shrink-0 border-b border-base-300 bg-base-100">
            <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2.5 rounded-field focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                    <Logo className="size-8 shrink-0"/>
                    <span className="font-serif text-[1.7rem] leading-none tracking-tight">
                        We<em>Work</em>
                    </span>
                </Link>
                <div className="flex items-center gap-1 sm:gap-2">
                    <ThemeToggle/>
                    <ClerkUI/>
                </div>
            </div>
        </header>
    )
}
