'use client'

import { useOrganization } from "@clerk/nextjs"
import Link from "next/link";
import { ArrowLeftRight, ChevronDown, Plus, Settings, UsersRound } from "lucide-react";

export default function TeamsDrop() {
    const {organization} = useOrganization();

    // daisyUI dropdowns stay open while focused; drop focus once a link is chosen.
    function close() {
        (document.activeElement as HTMLElement | null)?.blur();
    }

    return (
        <div className='dropdown dropdown-end'>
            <div tabIndex={0} role={`button`} className='btn btn-ghost btn-sm gap-2' aria-label="Teams">
                <UsersRound className="size-4"/>
                <span className="hidden max-w-36 truncate sm:inline">{organization ? organization.name : `Personal`}</span>
                <ChevronDown className="size-3.5 opacity-60"/>
            </div>
            <ul tabIndex={-1} className='menu dropdown-content z-50 mt-2 w-56 rounded-box border border-base-300 bg-base-100 p-1.5 shadow-lg' onClick={close}>
                <li className="menu-title text-xs">{organization ? organization.name : `Personal workspace`}</li>
                <li><Link href="/organizations/create-org"><Plus className="size-4"/>Create team</Link></li>
                {organization ?
                <li><Link href={`/organizations/org-profile/${organization.name}`}><Settings className="size-4"/>Team profile</Link></li>
                : null
                }
                <li><Link href="/organizations/org-list"><ArrowLeftRight className="size-4"/>Switch or manage teams</Link></li>
            </ul>
        </div>
    )
}
