'use client'

import { Bold, Check, Italic, List, ListChecks, Table, Underline } from "lucide-react";
import { CSSProperties, useEffect, useState } from "react";
import { COLLAB_COLORS, initials } from "../lib/collaborators";

const ADA = {name: 'Ada', color: COLLAB_COLORS[5]};
const GRACE = {name: 'Grace', color: COLLAB_COLORS[2]};
const ALAN = {name: 'Alan', color: COLLAB_COLORS[7]};

const PHRASES = [
    'Ship it on Thursday, after the load test.',
    'Grace owns the launch post.',
    'Offline mode is good to go.',
];

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(query.matches);

        const onChange = () => setReduced(query.matches);
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, [])

    return reduced;
}

// Types, pauses, deletes, moves on to the next phrase.
function useTypewriter(phrases: string[], enabled: boolean) {
    const [text, setText] = useState(phrases[0]);

    useEffect(() => {
        if(!enabled) {
            setText(phrases[0]);
            return;
        }

        let phrase = 0;
        let length = 0;
        let deleting = false;
        let timer: ReturnType<typeof setTimeout>;

        function tick() {
            const target = phrases[phrase];

            if(!deleting) {
                length++;
                setText(target.slice(0, length));

                if(length === target.length) {
                    deleting = true;
                    timer = setTimeout(tick, 2200);
                    return;
                }
                timer = setTimeout(tick, 55 + Math.random() * 60);
            }
            else {
                length--;
                setText(target.slice(0, length));

                if(length === 0) {
                    deleting = false;
                    phrase = (phrase + 1) % phrases.length;
                    timer = setTimeout(tick, 500);
                    return;
                }
                timer = setTimeout(tick, 22);
            }
        }

        setText('');
        timer = setTimeout(tick, 800);
        return () => clearTimeout(timer);
    }, [phrases, enabled])

    return text;
}

function Caret({person}: {person: {name: string, color: string}}) {
    return (
        <span className="collab-caret" style={{'--caret-color': person.color} as CSSProperties}>
            <span className="collab-caret__label">{person.name}</span>
        </span>
    )
}

export default function HeroDemo() {
    const reduced = usePrefersReducedMotion();
    const typed = useTypewriter(PHRASES, !reduced);
    const [checked, setChecked] = useState(false);
    const [showChat, setShowChat] = useState(true);

    useEffect(() => {
        if(reduced) return;

        const check = setInterval(() => setChecked(c => !c), 3600);
        const chat = setInterval(() => setShowChat(s => !s), 5200);

        return () => {
            clearInterval(check);
            clearInterval(chat);
        }
    }, [reduced])

    return (
        <div className="relative" aria-hidden="true">
            <div className="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-2xl shadow-base-content/10">
                <div className="flex items-center justify-between gap-3 border-b border-base-300 px-4 py-3">
                    <span className="truncate font-serif text-2xl leading-none">Launch plan</span>
                    <div className="flex items-center gap-2.5">
                        <div className="flex -space-x-1">
                            {[ADA, GRACE, ALAN].map(p => (
                                <div key={p.name} className="grid size-7 place-items-center rounded-full text-[0.65rem] font-semibold text-white ring-2 ring-base-100" style={{backgroundColor: p.color}}>
                                    {initials(p.name)}
                                </div>
                            ))}
                        </div>
                        <div className="flex h-6 items-center gap-1.5 rounded-full border border-base-300 px-2 text-[0.7rem] font-medium">
                            <span className="relative flex size-1.5">
                                <span className="absolute inline-flex size-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-success opacity-60"/>
                                <span className="relative inline-flex size-1.5 rounded-full bg-success"/>
                            </span>
                            Live
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 border-b border-base-300 px-3 py-1.5 text-base-content/50">
                    <span className="mr-1 rounded-field px-2 py-1 text-xs">Normal text</span>
                    {[Bold, Italic, Underline, List, ListChecks, Table].map((Icon, i) => (
                        <span key={i} className="grid size-7 place-items-center rounded-field"><Icon className="size-3.5"/></span>
                    ))}
                </div>

                <div className="bg-base-200 p-4 sm:p-6">
                    <div className="rounded-field border border-base-300 bg-base-100 px-6 py-6 text-[0.95rem] leading-8 sm:px-8">
                        <h3 className="font-serif text-3xl leading-tight">Launch plan</h3>
                        <p className="mt-3">
                            We&apos;re shipping the editor to the first teams next week.{' '}
                            <span style={{backgroundColor: `${GRACE.color}2e`}}>Everyone signs off by Friday.</span>
                            <Caret person={GRACE}/>
                        </p>
                        <p className="mt-3 min-h-8">
                            {typed}
                            <Caret person={ADA}/>
                        </p>
                        <ul className="mt-3 space-y-1">
                            <li className="flex items-center gap-2.5">
                                <span className="grid size-4 place-items-center rounded-sm bg-accent text-accent-content"><Check className="size-3" strokeWidth={3}/></span>
                                <span className="text-base-content/50 line-through">Presence avatars</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <span className={`grid size-4 place-items-center rounded-sm border transition-colors ${checked ? 'border-accent bg-accent text-accent-content' : 'border-base-content/30'}`}>{checked && <Check className="size-3" strokeWidth={3}/>}</span>
                                <span className={`transition-colors ${checked ? 'text-base-content/50 line-through' : ''}`}>Offline copy review</span>
                                <Caret person={ALAN}/>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={`absolute right-3 -bottom-10 max-w-64 rounded-box border border-base-300 bg-base-100 p-3 shadow-xl transition-all duration-500 sm:-right-6 ${showChat ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                <div className="flex items-center gap-2 text-[0.7rem]">
                    <span className="grid size-5 place-items-center rounded-full text-[0.55rem] font-semibold text-white" style={{backgroundColor: GRACE.color}}>G</span>
                    <span className="font-semibold" style={{color: GRACE.color}}>Grace</span>
                    <span className="text-base-content/45">just now</span>
                </div>
                <p className="mt-1.5 rounded-2xl rounded-bl-md bg-base-200 px-3 py-1.5 text-sm">Looks great. Shipping it Thursday!</p>
            </div>
        </div>
    )
}
