'use client'

import type { Editor } from "@tiptap/core"
import { FloatingMenu } from '@tiptap/react/menus'
import { Heading1, Heading2, Heading3, List, ListChecks, ListOrdered, SeparatorHorizontal, SquareCode, Table, TextQuote } from "lucide-react";
import { ReactNode } from "react";
import { keepSelection } from "./toolbarMenu";
import { ImageButton } from "./menuBar";

// Shown on an empty line: quick ways to start a new block.
export default function InsertMenu({editor}: {editor: Editor}) {
    const groups: {label: string, icon: ReactNode, run: () => boolean}[][] = [
        [
            {label: 'Heading 1', icon: <Heading1 className="size-4"/>, run: () => editor.chain().focus().setHeading({level: 1}).run()},
            {label: 'Heading 2', icon: <Heading2 className="size-4"/>, run: () => editor.chain().focus().setHeading({level: 2}).run()},
            {label: 'Heading 3', icon: <Heading3 className="size-4"/>, run: () => editor.chain().focus().setHeading({level: 3}).run()},
        ],
        [
            {label: 'Bullet list', icon: <List className="size-4"/>, run: () => editor.chain().focus().toggleBulletList().run()},
            {label: 'Numbered list', icon: <ListOrdered className="size-4"/>, run: () => editor.chain().focus().toggleOrderedList().run()},
            {label: 'Task list', icon: <ListChecks className="size-4"/>, run: () => editor.chain().focus().toggleTaskList().run()},
        ],
        [
            {label: 'Quote', icon: <TextQuote className="size-4"/>, run: () => editor.chain().focus().setBlockquote().run()},
            {label: 'Code block', icon: <SquareCode className="size-4"/>, run: () => editor.chain().focus().setCodeBlock().run()},
            {label: 'Table', icon: <Table className="size-4"/>, run: () => editor.chain().focus().insertTable({rows: 3, cols: 3, withHeaderRow: true}).run()},
            {label: 'Divider', icon: <SeparatorHorizontal className="size-4"/>, run: () => editor.chain().focus().setHorizontalRule().run()},
        ],
    ];

    return (
        <FloatingMenu editor={editor} options={{placement: 'bottom-start', offset: 6}} className="z-20">
            <div data-testid='floating-menu' className="not-prose flex items-center gap-0.5 rounded-box border border-base-300 bg-base-100 p-1 shadow-lg">
                {groups.map((group, i) => (
                    <div key={i} className="flex items-center gap-0.5">
                        {i > 0 && <div className="mx-0.5 h-5 w-px bg-base-300" aria-hidden="true"/>}
                        {group.map(item => (
                            <button key={item.label} type="button" aria-label={item.label} data-tip={item.label} onMouseDown={keepSelection} onClick={item.run}
                                className="btn btn-ghost btn-sm btn-square tooltip tooltip-bottom">
                                {item.icon}
                            </button>
                        ))}
                    </div>
                ))}
                <ImageButton editor={editor}/>
            </div>
        </FloatingMenu>
    )
}
