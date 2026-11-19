'use client'

import type { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import { initials } from "../lib/collaborators";

type Peer = {key: string, name: string, color: string, isSelf: boolean};

const MAX_SHOWN = 4;

// Avatars for everyone currently in the document, read from the Yjs awareness
// state that CollaborationCaret publishes.
export default function Presence({provider, selfId}: {provider: HocuspocusProvider, selfId: string}) {
    const [peers, setPeers] = useState<Peer[]>([]);

    useEffect(() => {
        const awareness = provider.awareness;
        if(!awareness) return;

        let signature = '';

        function update() {
            const byUser = new Map<string, Peer>();

            awareness!.getStates().forEach((state, clientId) => {
                const user = state.user;
                if(!user?.name) return;

                // The same person in two tabs shows up once.
                const key = user.userId ?? String(clientId);
                if(!byUser.has(key)) byUser.set(key, {key, name: user.name, color: user.color, isSelf: user.userId === selfId});
            });

            const next = [...byUser.values()].sort((a, b) => Number(b.isSelf) - Number(a.isSelf));

            // Awareness changes on every cursor move; only re-render when the people change.
            const nextSignature = next.map(p => `${p.key}:${p.name}:${p.color}`).join('|');
            if(nextSignature === signature) return;

            signature = nextSignature;
            setPeers(next);
        }

        update();
        awareness.on('change', update);

        return () => awareness.off('change', update);
    }, [provider, selfId])

    if(peers.length === 0) return null;

    const shown = peers.slice(0, MAX_SHOWN);
    const hidden = peers.slice(MAX_SHOWN);

    return (
        <div className="flex items-center -space-x-1" aria-label={`${peers.length} ${peers.length === 1 ? 'person' : 'people'} in this document`}>
            {shown.map(p => (
                <div key={p.key} className="tooltip tooltip-bottom hover:z-10" data-tip={p.isSelf ? `${p.name} (you)` : p.name}>
                    <div className="grid size-8 animate-pop-in place-items-center rounded-full text-xs font-semibold text-white ring-2 ring-base-100 select-none" style={{backgroundColor: p.color}}>
                        {initials(p.name)}
                    </div>
                </div>
            ))}
            {hidden.length > 0 &&
                <div className="tooltip tooltip-bottom hover:z-10" data-tip={hidden.map(p => p.name).join(', ')}>
                    <div className="grid size-8 place-items-center rounded-full bg-base-300 text-xs font-medium ring-2 ring-base-100 select-none">
                        +{hidden.length}
                    </div>
                </div>
            }
        </div>
    )
}
