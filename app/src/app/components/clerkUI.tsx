'use client'

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import TeamsDrop from "./teamsNav"
import Link from "next/link"

export default function ClerkUI() {
    return (
        <div className="flex gap-2">
            <SignedOut>
                <SignInButton>
                    <button className="btn bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign In
                    </button>
                </SignInButton>
                <SignUpButton>
                    <button className="btn bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                    </button>
                </SignUpButton>
            </SignedOut>
            <SignedIn>
                <div className="flex gap-3 items-center">
                    <TeamsDrop/>
                    <Link href="/dashboard">
                    <button className="btn">Dashboard</button>
                    </Link>        
                    <UserButton/>
                </div>
            </SignedIn>
        </div>
    )
}