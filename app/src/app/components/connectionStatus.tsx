'use client'

import type { HocuspocusProvider } from "@hocuspocus/provider";
import { CloudOff, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

type Status = 'connecting' | 'connected' | 'disconnected';

export default function ConnectionStatus({provider}: {provider: HocuspocusProvider}) {
    const [status, setStatus] = useState<Status>('connecting');
    const [synced, setSynced] = useState(false);
    const [unsynced, setUnsynced] = useState(0);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const onStatus = ({status}: {status: Status}) => setStatus(status);
        const onSynced = ({state}: {state: boolean}) => setSynced(state);
        const onUnsynced = ({number}: {number: number}) => setUnsynced(number);

        provider.on('status', onStatus);
        provider.on('synced', onSynced);
        provider.on('unsyncedChanges', onUnsynced);

        // Catch up on anything that happened before we subscribed.
        setStatus(provider.configuration.websocketProvider.status as Status);
        setSynced(provider.isSynced);
        setUnsynced(provider.unsyncedChanges);

        return () => {
            provider.off('status', onStatus);
            provider.off('synced', onSynced);
            provider.off('unsyncedChanges', onUnsynced);
        }
    }, [provider])

    // Every keystroke is briefly "unsynced"; only say so if it lasts.
    useEffect(() => {
        if(unsynced === 0) {
            setSaving(false);
            return;
        }

        const timer = setTimeout(() => setSaving(true), 600);
        return () => clearTimeout(timer);
    }, [unsynced])

    if(status === 'disconnected') {
        return (
            <Pill tip="Your edits are kept on this device and will sync when you reconnect" className="border-warning/40 text-warning">
                <CloudOff className="size-3.5"/>
                Offline
            </Pill>
        )
    }

    if(status === 'connecting' || !synced) {
        return (
            <Pill tip="Connecting to the collaboration server">
                <LoaderCircle className="size-3.5 animate-spin"/>
                Connecting
            </Pill>
        )
    }

    if(saving) {
        return (
            <Pill tip="Sending your latest edits">
                <LoaderCircle className="size-3.5 animate-spin"/>
                Saving
            </Pill>
        )
    }

    return (
        <Pill tip="Connected — edits sync in real time">
            <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-success opacity-60"/>
                <span className="relative inline-flex size-2 rounded-full bg-success"/>
            </span>
            Live
        </Pill>
    )
}

function Pill({tip, className = '', children}: {tip: string, className?: string, children: React.ReactNode}) {
    return (
        <div className="tooltip tooltip-left" data-tip={tip}>
            <div role="status" className={`flex h-7 items-center gap-1.5 rounded-full border border-base-300 px-2.5 text-xs font-medium whitespace-nowrap ${className}`}>
                {children}
            </div>
        </div>
    )
}
