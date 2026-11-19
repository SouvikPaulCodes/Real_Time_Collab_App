'use client'

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import TeamsDrop from "./teamsNav"
import Link from "next/link"
import { LayoutGrid } from "lucide-react"

export default function ClerkUI() {
    return (
        <div className="flex items-center gap-1 sm:gap-2">
            <Show when="signed-out">
                <SignInButton mode="modal">
                    <button className="btn btn-ghost btn-sm">Sign in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                    <button className="btn btn-primary btn-sm">Get started</button>
                </SignUpButton>
            </Show>
            <Show when="signed-in">
                <TeamsDrop/>
                <Link href="/dashboard" className="btn btn-ghost btn-sm" aria-label="Dashboard">
                    <LayoutGrid className="size-4"/>
                    <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <div className="ml-1 flex items-center">
                    <UserButton/>
                </div>
            </Show>
        </div>
    )
}
