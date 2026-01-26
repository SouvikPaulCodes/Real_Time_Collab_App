'use client'

import {io, Socket} from 'socket.io-client';
import { ClientToServerEvents, Memberships, Message, ServerToClientEvents } from '../lib/definitions';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { SendHorizonal } from 'lucide-react';

export default function Messaging({token, docName, messages, userId}: {token: string, docName: string, messages: Message[] | undefined, userId: string}) {

    let socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

    const {isLoaded, memberships} = useOrganization({
        memberships: true,
    });

    const mem: Memberships[] | undefined = useMemo(() => {
        if (!isLoaded || !memberships?.data) return [];

        return memberships.data.map(m => ({
            fullName: `${m.publicUserData?.firstName ?? ''} ${m.publicUserData?.lastName ?? ''}`.trim(),
            userId: m.publicUserData?.userId,
            image: m.publicUserData?.imageUrl,
            role: m.roleName
        }));
    }, [isLoaded, memberships?.data]);

    const [msg, setMsg] = useState(messages)

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
            withCredentials: true,
            auth: {
                token,
                docName
            }
        })

        socketRef.current = socket;

        socket.on('connect', () => console.log('Client is connected to message socket'));
        socket.on('disconnect', () => console.log('Client is disconnected from message socket'));

        socket.on('message', (msg: Message) => {
            setMsg((prev) => [
                ...prev ?? [],
                msg
            ])
        })

        return(() => {
            socket.off('message');
            socket.disconnect()
        })
    }, [token, docName])

    const curYear = new Date().getUTCFullYear();
    const curMonth = new Date().getUTCMonth();
    const curDate = new Date().getUTCDate();

    const todayStr = `${curYear}-${curMonth+1<10 && `0`}${curMonth+1}-${curDate<10 && `0`}${curDate}`;
    const today = new Date(todayStr);

    const [msgInp, setMsgInp] = useState('');

    function sendMsg(e: FormEvent) {
        e.preventDefault();

        socketRef.current?.emit('message', {
            content: msgInp,
            senderId: userId,
            workspaceId: docName,
        })

        setMsgInp('');
    }
     

    return (
        <div className="hidden lg:flex lg:flex-col w-90 justify-self-end h-[90vh] sticky top-22 border border-black rounded-xl bg-base-100">
            <h2 className='text-center text-2xl grow-0 p-2 bg-warning-content text-neutral-content rounded-t-xl mb-1'>Messaging</h2>
            <div className="grow min-h-[70%] flex flex-col gap-2 overflow-auto p-1">
                {
                    msg ? msg.map((m, i) => {
                            let isNew: boolean = true;
                            if(i>0) {
                                const prevDay = msg[i-1].createdAt.split('T')[0];
                                const curDay = msg[i].createdAt.split('T')[0];

                                if(curDay===prevDay) isNew = false;
                            }
                            return (
                                <div key={m.id} className='flex flex-col gap-2'>
                                    {isNew ? 
                                    new Date(m.createdAt.split('T')[0]).getTime() === today.getTime() ? 
                                        <div className='self-center p-2 rounded-xl bg-info text-neutral'>Today</div>
                                        : <div className='self-center p-2 rounded-xl bg-info text-neutral'>{m.createdAt.split('T')[0]}</div>
                                    : null}
                                    <div className={`chat ${m.senderId===userId ? `chat-end` : `chat-start`}`}>
                                        <div className="chat-image avatar">
                                            <div className="w-10 rounded-full">
                                            <img
                                                alt={`${mem?.filter(mem => mem.userId===m.senderId)[0]?.fullName || `default`} avatar`}
                                                src={mem?.filter(mem => mem.userId===m.senderId)[0]?.image || `#`}
                                            />
                                            </div>
                                        </div>
                                        <div className='chat-header text-base-content'>
                                            {mem?.filter(mem => mem.userId===m.senderId)[0]?.fullName}
                                            <time>{m.createdAt.split('T')[1].split('.')[0].slice(0,-3)}</time>
                                        </div>
                                        <div className={`chat-bubble ${m.senderId===userId ? `bg-accent-content` : ``} text-neutral-content`}>
                                            {m.content}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    : <div className='self-center'>No messages</div>                    
                }
            </div>
            <form className="flex gap-1 p-1" onSubmit={(e) => sendMsg(e)}>
                <input type="text"  required className='input rounded-r-full rounded-l-full min-h-max' value={msgInp} onChange={(e) => {
                    const inp = e.currentTarget.value;

                    setMsgInp(inp);
                }}/>
                <button type='submit' className='btn'>
                    <SendHorizonal width={20} height={20} />
                </button>
            </form>
        </div>
    )
}