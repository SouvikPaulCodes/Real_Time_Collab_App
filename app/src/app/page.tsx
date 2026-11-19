import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, LayoutGrid, MessagesSquare, MousePointer2, Table, Users, WifiOff } from "lucide-react";
import HeroDemo from "./components/heroDemo";
import Logo from "./components/logo";
import { COLLAB_COLORS } from "./lib/collaborators";

const FEATURES = [
    {icon: MousePointer2, color: COLLAB_COLORS[5], title: 'Every cursor, live', body: "See who's writing where. Each person gets their own colour, name tag and selection highlight."},
    {icon: MessagesSquare, color: COLLAB_COLORS[2], title: 'Chat beside the doc', body: 'Talk through changes in a side panel without leaving the page or losing your place.'},
    {icon: WifiOff, color: COLLAB_COLORS[7], title: 'Keeps working offline', body: "Edits are saved on your device and sync automatically when you're back online."},
    {icon: Users, color: COLLAB_COLORS[3], title: 'Personal or team', body: 'Keep private docs to yourself, or create a team and share everything with it.'},
    {icon: Table, color: COLLAB_COLORS[0], title: 'Rich documents', body: 'Headings, tables, task lists, images and code blocks, with an outline that follows along.'},
    {icon: LayoutGrid, color: COLLAB_COLORS[6], title: 'Everything in one place', body: 'A dashboard of every document, with the most recently edited first.'},
];

function PrimaryCta({signedIn, inverted = false}: {signedIn: boolean, inverted?: boolean}) {
    const className = `btn btn-lg ${inverted ? 'border-none bg-primary-content text-primary hover:bg-primary-content/90' : 'btn-primary'}`;

    if(signedIn) {
        return (
            <Link href="/dashboard" className={className}>
                Open your dashboard
                <ArrowRight className="size-4"/>
            </Link>
        )
    }

    return (
        <SignUpButton mode="modal">
            <button className={className}>
                Start writing
                <ArrowRight className="size-4"/>
            </button>
        </SignUpButton>
    )
}

export default async function Home() {
    const {isAuthenticated} = await auth();

    return (
        <main className="flex-1">
            <section className="relative overflow-hidden">
                <div className="dot-grid absolute inset-0" aria-hidden="true"/>
                <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:pt-24 lg:pb-28">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-medium">
                            <span className="size-1.5 rounded-full bg-success"/>
                            Real-time collaborative documents
                        </div>
                        <h1 className="mt-6 font-serif text-6xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
                            Many hands,
                            <br/>
                            <em className="text-accent">one page.</em>
                        </h1>
                        <p className="mt-6 max-w-md text-lg leading-relaxed text-base-content/70">
                            WeWork is a shared editor for teams. Write together in real time, see every cursor, and talk it through without leaving the doc.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <PrimaryCta signedIn={isAuthenticated}/>
                            {!isAuthenticated &&
                                <SignInButton mode="modal">
                                    <button className="btn btn-ghost btn-lg">I have an account</button>
                                </SignInButton>
                            }
                        </div>
                    </div>

                    <HeroDemo/>
                </div>
            </section>

            <section className="border-t border-base-300 bg-base-200/60">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
                    <div className="max-w-xl">
                        <h2 className="font-serif text-4xl sm:text-5xl">Built for writing together</h2>
                        <p className="mt-3 text-base-content/65">Everything you need to draft, discuss and finish a document with other people, in one place.</p>
                    </div>
                    <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map(({icon: Icon, color, title, body}) => (
                            <div key={title}>
                                <div className="grid size-10 place-items-center rounded-field" style={{backgroundColor: `${color}1f`, color}}>
                                    <Icon className="size-5"/>
                                </div>
                                <h3 className="mt-4 font-medium">{title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-base-content/65">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
                <div className="flex flex-col items-start justify-between gap-8 rounded-box bg-primary px-8 py-12 text-primary-content sm:px-12 md:flex-row md:items-center">
                    <div>
                        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">Better with company.</h2>
                        <p className="mt-2 max-w-md text-primary-content/75">Start a document, share it with your team, and watch it come together.</p>
                    </div>
                    <PrimaryCta signedIn={isAuthenticated} inverted/>
                </div>
            </section>

            <footer className="border-t border-base-300">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-base-content/55 sm:px-6">
                    <div className="flex items-center gap-2">
                        <Logo className="size-6"/>
                        <span className="font-serif text-2xl leading-none text-base-content">We<em>Work</em></span>
                    </div>
                    <p>A real-time collaborative editor · Built with Next.js, Tiptap and Hocuspocus</p>
                </div>
            </footer>
        </main>
    )
}
