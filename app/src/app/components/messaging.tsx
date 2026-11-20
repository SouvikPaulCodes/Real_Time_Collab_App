'use client'

import {io, Socket} from 'socket.io-client';
import { ClientToServerEvents, Message, ServerToClientEvents } from '../lib/definitions';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useOrganization, useUser } from '@clerk/nextjs';
import { MessagesSquare, SendHorizonal, WifiOff, X } from 'lucide-react';
import { colorFor, initials } from '../lib/collaborators';

// Consecutive messages from one person within this window are grouped together.
const GROUP_WINDOW_MS = 5 * 60 * 1000;

type Person = {name: string, image?: string};

type Row =
    | {type: 'day', key: string, label: string}
    | {type: 'message', key: string, message: Message, startsGroup: boolean, endsGroup: boolean};

function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dayLabel(date: Date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if(sameDay(date, today)) return 'Today';
    if(sameDay(date, yesterday)) return 'Yesterday';

    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        ...(date.getFullYear() !== today.getFullYear() && {year: 'numeric'}),
    });
}

function timeLabel(date: Date) {
    return date.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit'});
}

export default function Messaging({token, docName, messages, userId, onClose, onIncoming}: {
    token: string,
    docName: string,
    messages: Message[] | undefined,
    userId: string,
    onClose?: () => void,
    onIncoming?: () => void,
}) {
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const stickToBottom = useRef(true);
    const hasScrolled = useRef(false);
    const onIncomingRef = useRef(onIncoming);
    onIncomingRef.current = onIncoming;

    const {organization, memberships} = useOrganization({
        memberships: {pageSize: 100},
    });
    const {user} = useUser();

    const people = useMemo(() => {
        const map = new Map<string, Person>();

        memberships?.data?.forEach(m => {
            const data = m.publicUserData;
            if(!data?.userId) return;

            map.set(data.userId, {
                name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || data.identifier,
                image: data.hasImage ? data.imageUrl : undefined,
            });
        });

        if(user) map.set(user.id, {name: user.fullName || user.firstName || 'You', image: user.hasImage ? user.imageUrl : undefined});

        return map;
    }, [memberships?.data, user]);

    const [msg, setMsg] = useState(messages)
    const [connected, setConnected] = useState(true);

    // Dates are shown in the viewer's timezone, which the server doesn't know.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
            withCredentials: true,
            auth: {
                token,
                docName
            }
        })

        socketRef.current = socket;

        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));
        socket.on('connect_error', () => setConnected(false));

        socket.on('message', (msg: Message) => {
            setMsg((prev) => [
                ...prev ?? [],
                msg
            ])

            if(msg.senderId !== userId) onIncomingRef.current?.();
        })

        return(() => {
            socket.off('message');
            socket.disconnect()
        })
    }, [token, docName, userId])

    const rows = useMemo(() => {
        if(!mounted || !msg) return [];

        const out: Row[] = [];
        let prev: Message | undefined;

        for(const m of msg) {
            const date = new Date(m.createdAt);

            if(!prev || !sameDay(new Date(prev.createdAt), date)) {
                out.push({type: 'day', key: `day-${m.id}`, label: dayLabel(date)});
                prev = undefined;
            }

            const startsGroup = !prev || prev.senderId !== m.senderId || date.getTime() - new Date(prev.createdAt).getTime() > GROUP_WINDOW_MS;

            out.push({type: 'message', key: m.id, message: m, startsGroup, endsGroup: true});
            prev = m;
        }

        out.forEach((row, i) => {
            const next = out[i + 1];
            if(row.type === 'message') row.endsGroup = !next || next.type !== 'message' || next.startsGroup;
        });

        return out;
    }, [msg, mounted]);

    // Follow new messages if the reader is already at the bottom (or sent it).
    useEffect(() => {
        const list = listRef.current;
        if(!list || rows.length === 0) return;

        const last = msg?.[msg.length - 1];

        if(!hasScrolled.current) {
            list.scrollTop = list.scrollHeight;
            hasScrolled.current = true;
        }
        else if(stickToBottom.current || last?.senderId === userId) {
            list.scrollTo({top: list.scrollHeight, behavior: 'smooth'});
        }
    }, [rows])

    const [msgInp, setMsgInp] = useState('');

    function sendMsg(e: FormEvent) {
        e.preventDefault();

        const content = msgInp.trim();
        if(!content) return;

        // The server attributes the message from the verified token
        socketRef.current?.emit('message', {content})

        setMsgInp('');
    }

    return (
        <div className="flex h-full w-full flex-col bg-base-100">
            <div className="flex items-center justify-between gap-3 border-b border-base-300 px-5 py-4">
                <div className="min-w-0">
                    <h2 className="font-serif text-2xl leading-none">Chat</h2>
                    <p className="mt-1 truncate text-xs text-base-content/55">
                        {organization ? `${organization.name} · ${organization.membersCount} ${organization.membersCount === 1 ? 'member' : 'members'}` : 'Private to you'}
                    </p>
                </div>
                {onClose &&
                    <button type="button" className="btn btn-ghost btn-sm btn-square lg:hidden" aria-label="Close chat" onClick={onClose}>
                        <X className="size-4"/>
                    </button>
                }
            </div>

            {!connected &&
                <div role="status" className="flex items-center gap-2 border-b border-base-300 bg-warning/10 px-5 py-2 text-xs">
                    <WifiOff className="size-3.5 text-warning"/>
                    Reconnecting to chat…
                </div>
            }

            <div ref={listRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-2 pb-4" onScroll={(e) => {
                const el = e.currentTarget;
                stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
            }}>
                {!mounted ?
                    <div className="flex flex-col gap-3 pt-4" aria-hidden="true">
                        <div className="skeleton h-9 w-2/3"/>
                        <div className="skeleton h-9 w-1/2 self-end"/>
                        <div className="skeleton h-9 w-3/5"/>
                    </div>
                : rows.length === 0 ?
                    <div className="m-auto flex max-w-60 flex-col items-center py-10 text-center">
                        <div className="mb-3 grid size-12 place-items-center rounded-full bg-base-200">
                            <MessagesSquare className="size-5 opacity-60"/>
                        </div>
                        <p className="text-sm font-medium">No messages yet</p>
                        <p className="mt-1 text-xs leading-relaxed text-base-content/55">Talk about this doc without leaving it. Everyone with access can see the chat.</p>
                    </div>
                :
                    rows.map(row => row.type === 'day' ?
                        <div key={row.key} className="my-3 flex items-center gap-3 text-[0.7rem] font-medium text-base-content/45">
                            <div className="h-px flex-1 bg-base-300"/>
                            {row.label}
                            <div className="h-px flex-1 bg-base-300"/>
                        </div>
                        :
                        <ChatMessage key={row.key} message={row.message} startsGroup={row.startsGroup} endsGroup={row.endsGroup} isOwn={row.message.senderId === userId} person={people.get(row.message.senderId)}/>
                    )
                }
            </div>

            <form className="border-t border-base-300 p-3" onSubmit={sendMsg}>
                <div className="flex items-end gap-2 rounded-box border border-base-300 bg-base-100 py-1.5 pr-1.5 pl-3 transition-colors focus-within:border-base-content/30">
                    <textarea rows={1} value={msgInp} placeholder="Message…" aria-label="Message"
                        className="max-h-32 min-h-8 flex-1 resize-none bg-transparent py-1.5 text-sm outline-none field-sizing-content placeholder:text-base-content/40"
                        onChange={(e) => setMsgInp(e.currentTarget.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                                e.preventDefault();
                                e.currentTarget.form?.requestSubmit();
                            }
                        }}/>
                    <button type='submit' className='btn btn-primary btn-sm btn-square' aria-label="Send message" disabled={!msgInp.trim() || !connected}>
                        <SendHorizonal className="size-4"/>
                    </button>
                </div>
                <p className="mt-1.5 px-1 text-[0.7rem] text-base-content/40 max-sm:hidden">Enter to send · Shift + Enter for a new line</p>
            </form>
        </div>
    )
}

function ChatMessage({message, startsGroup, endsGroup, isOwn, person}: {message: Message, startsGroup: boolean, endsGroup: boolean, isOwn: boolean, person: Person | undefined}) {
    const time = timeLabel(new Date(message.createdAt));
    const name = person?.name ?? 'Unknown';

    if(isOwn) {
        return (
            <div className={`flex flex-col items-end ${startsGroup ? 'mt-3' : 'mt-0.5'}`}>
                {startsGroup && <time className="mb-1 text-[0.7rem] text-base-content/45">{time}</time>}
                <div className={`max-w-[85%] rounded-2xl bg-primary px-3 py-1.5 text-sm wrap-break-word whitespace-pre-wrap text-primary-content ${endsGroup ? 'rounded-br-md' : ''}`}>
                    {message.content}
                </div>
            </div>
        )
    }

    return (
        <div className={`flex gap-2 ${startsGroup ? 'mt-3' : 'mt-0.5'}`}>
            <div className="w-7 shrink-0">
                {startsGroup && <Avatar id={message.senderId} person={person}/>}
            </div>
            <div className="flex max-w-[85%] min-w-0 flex-col items-start">
                {startsGroup &&
                    <div className="mb-1 flex items-baseline gap-2 text-[0.7rem]">
                        <span className="font-semibold" style={{color: colorFor(message.senderId)}}>{name}</span>
                        <time className="text-base-content/45">{time}</time>
                    </div>
                }
                <div className={`rounded-2xl bg-base-200 px-3 py-1.5 text-sm wrap-break-word whitespace-pre-wrap ${endsGroup ? 'rounded-bl-md' : ''}`}>
                    {message.content}
                </div>
            </div>
        </div>
    )
}

function Avatar({id, person}: {id: string, person: Person | undefined}) {
    if(person?.image) {
        return <img src={person.image} alt="" className="size-7 rounded-full object-cover"/>
    }

    return (
        <div className="grid size-7 place-items-center rounded-full text-[0.65rem] font-semibold text-white select-none" style={{backgroundColor: colorFor(id)}} aria-hidden="true">
            {initials(person?.name ?? '?')}
        </div>
    )
}
