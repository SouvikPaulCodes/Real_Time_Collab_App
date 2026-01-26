'use client'

import React, { useEffect, useState } from "react"
import ClerkUI from '../components/clerkUI'
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeSetter({children}: {children: React.ReactNode}) {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    },[])

    return (
        <>
            <ul className="background -z-10 bg-base-200" aria-hidden="true">
                {[...Array(10)].map((_, i) => (
                <li key={i} className='bg-neutral-content'></li>
                ))}
            </ul>
            <div className="relative z-0 min-h-screen">
                <header className="flex justify-between flex-auto items-center gap-4 bg-secondary p-5">
                    <div className="title">
                        <img src="" alt="" />
                        <div className="actTitle text-2xl">WeWork</div>
                    </div>
                    <div className="flex gap-2">
                        {
                            mounted && 
                            <label className="swap swap-rotate">                       
                                <input type="checkbox" className="theme-controller" value="dark" checked={theme==='dark'} onChange={(e) => {
                                    const th = e.currentTarget.checked;

                                    if(th) setTheme('dark');
                                    else setTheme('light')
                                }}/>

                                <Sun width={30} height={30} className="swap-off"/>

                                <Moon width={30} height={30} className="swap-on"/>
                            </label>
                        }
                        <ClerkUI/> 
                    </div>
                </header>
                {children}
            </div>
        </>
    )
}