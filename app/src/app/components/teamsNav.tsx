'use client'

import { useOrganization } from "@clerk/nextjs"
import Link from "next/link";
import {Cog6ToothIcon} from "@heroicons/react/20/solid"

export default function TeamsDrop() {
    const {organization} = useOrganization();

    return (
        <div className='dropdown dropdown-end dropdown-hover'>
            <div tabIndex={0} role={`button`}className='btn flex gap-2 items-center'>
                <Cog6ToothIcon className="h-5 w-5"/>
                <div>{organization ? organization.name : `Teams`}</div>
            </div>
            <ul tabIndex={-1} className='menu dropdown-content bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm"'>
                <li><Link href="/organizations/create-org">Create Team</Link></li>
                {organization ? 
                <li><Link href={`/organizations/org-profile/${organization.name}`}>Team Profile</Link></li> 
                : null
                }
                <li><Link href="/organizations/org-list">Manage Memberships</Link></li>
            </ul>
        </div>
    )
}