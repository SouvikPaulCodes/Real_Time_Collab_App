'use client'

import { ReactNode, useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

// Keeps the editor's selection intact when a toolbar control is clicked.
export const keepSelection = (e: React.MouseEvent) => e.preventDefault();

export default function ToolbarMenu({label, trigger, children, align = 'start', disabled, className = '', wrapperClassName = ''}: {
    label: string,
    trigger: ReactNode,
    children: (close: () => void) => ReactNode,
    align?: 'start' | 'end',
    disabled?: boolean,
    className?: string,
    wrapperClassName?: string,
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const openedFromKeyboard = useRef(false);

    const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)') ?? []);

    // Keyboard users land on the first item; mouse users keep focus in the editor.
    useEffect(() => {
        if(open && openedFromKeyboard.current) items()[0]?.focus();
        openedFromKeyboard.current = false;
    }, [open])

    useEffect(() => {
        if(!open) return;

        function onPointerDown(e: PointerEvent) {
            if(!ref.current?.contains(e.target as Node)) setOpen(false);
        }

        function onKeyDown(e: KeyboardEvent) {
            if(e.key !== 'Escape') return;

            if(menuRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
            setOpen(false);
        }

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        }
    }, [open])

    return (
        <div ref={ref} className={`relative ${wrapperClassName}`}>
            <button ref={triggerRef} type="button" disabled={disabled} aria-label={label} aria-haspopup="menu" aria-expanded={open} data-tip={label} onMouseDown={keepSelection} onClick={() => setOpen(o => !o)}
                onKeyDown={(e) => {
                    if(e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') openedFromKeyboard.current = true;
                    if(e.key === 'ArrowDown' && !open) {
                        e.preventDefault();
                        setOpen(true);
                    }
                }}
                className={`btn btn-ghost btn-sm gap-1 px-2 font-normal ${open ? 'bg-base-300' : 'tooltip tooltip-bottom'} ${className}`}>
                {trigger}
                <ChevronDown className="size-3 shrink-0 opacity-50"/>
            </button>
            {open &&
                <div ref={menuRef} role="menu" className={`absolute top-full z-40 mt-1.5 min-w-48 rounded-box border border-base-300 bg-base-100 p-1 shadow-xl ${align === 'end' ? 'right-0' : 'left-0'}`}
                    onKeyDown={(e) => {
                        if(e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

                        e.preventDefault();
                        const list = items();
                        const index = list.indexOf(document.activeElement as HTMLElement);
                        const next = e.key === 'ArrowDown' ? index + 1 : index - 1;
                        list[(next + list.length) % list.length]?.focus();
                    }}>
                    {children(() => setOpen(false))}
                </div>
            }
        </div>
    )
}

export function MenuItem({onSelect, active, danger, disabled, icon, children}: {
    onSelect: () => void,
    active?: boolean,
    danger?: boolean,
    disabled?: boolean,
    icon?: ReactNode,
    children: ReactNode,
}) {
    return (
        <button type="button" role="menuitem" disabled={disabled} onMouseDown={keepSelection} onClick={onSelect}
            className={`flex w-full items-center gap-2.5 rounded-field px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-base-200 focus-visible:bg-base-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 ${danger ? 'text-error' : ''}`}>
            {icon && <span className="flex size-4 shrink-0 items-center justify-center opacity-70">{icon}</span>}
            <span className="flex-1 whitespace-nowrap">{children}</span>
            {active && <Check className="size-4 shrink-0 text-accent"/>}
        </button>
    )
}

export function MenuLabel({children}: {children: ReactNode}) {
    return <div className="px-2.5 pt-2 pb-1 text-[0.7rem] font-medium uppercase tracking-wider opacity-50">{children}</div>
}

export function MenuDivider() {
    return <div className="my-1 h-px bg-base-300"/>
}
