'use client'

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const {resolvedTheme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    // The theme is only known on the client; keep the space reserved until then.
    if(!mounted) return <div className="size-8" aria-hidden="true"/>;

    const isDark = resolvedTheme === 'dark';

    return (
        <button type="button" className="btn btn-ghost btn-sm btn-square tooltip tooltip-bottom" data-tip={isDark ? 'Light mode' : 'Dark mode'} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            {isDark ? <Moon className="size-[18px]"/> : <Sun className="size-[18px]"/>}
        </button>
    )
}
