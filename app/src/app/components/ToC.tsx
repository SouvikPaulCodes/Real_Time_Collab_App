'use client'

import { TableOfContentData } from "@tiptap/extension-table-of-contents";
import { X } from "lucide-react";

export default function ToC({anchors, onNavigate, onClose}: {anchors: TableOfContentData, onNavigate?: () => void, onClose?: () => void}) {
    function goTo(id: string) {
        document.querySelector(`[data-toc-id="${id}"]`)?.scrollIntoView({behavior: 'smooth', block: 'start'});
        onNavigate?.();
    }

    return (
        <nav aria-label="Table of contents" className="flex flex-col">
            <div className="flex items-center justify-between px-5 pt-6 pb-3">
                <h2 className="text-[0.7rem] font-semibold uppercase tracking-wider text-base-content/50">On this page</h2>
                {onClose &&
                    <button type="button" className="btn btn-ghost btn-xs btn-square xl:hidden" aria-label="Close outline" onClick={onClose}>
                        <X className="size-4"/>
                    </button>
                }
            </div>
            {anchors.length === 0 ?
                <p className="px-5 text-sm leading-relaxed text-base-content/50">Headings you add will show up here.</p>
                :
                <ul className="mx-4 mb-6 border-l border-base-300">
                    {anchors.map((anchor) => (
                        <li key={anchor.id}>
                            <button type="button" title={anchor.textContent} onClick={() => goTo(anchor.id)}
                                className={`-ml-px block w-full truncate border-l-2 py-1.5 pr-2 text-left text-sm transition-colors focus-visible:bg-base-200 focus-visible:outline-none ${anchor.isActive ? 'border-accent font-medium text-base-content' : 'border-transparent text-base-content/60 hover:border-base-content/25 hover:text-base-content'} ${anchor.level === 1 ? 'pl-3' : anchor.level === 2 ? 'pl-6' : 'pl-9'}`}>
                                {anchor.textContent || <span className="italic opacity-60">Untitled heading</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            }
        </nav>
    )
}
