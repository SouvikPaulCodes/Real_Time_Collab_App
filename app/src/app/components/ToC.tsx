'use client'

import { TableOfContentData } from "@tiptap/extension-table-of-contents";
import Link from "next/link";

export default function ToC({anchors}: {anchors: TableOfContentData}) {
    console.log(anchors);

    return (
        <div className={`hidden lg:block justify-self-start sticky top-22 w-64 p-1 h-max max-h-[70vh] overflow-auto`}>
            <div className="text-2xl font-bold">Table of contents</div>
            <ul className="flex flex-col menu">
                {
                    anchors.map((anchor) => (
                    <li key={anchor.id}>
                        <Link href={`#${anchor.id}`} className={`text-lg ${anchor.level===1 ? `pl-0.5` : anchor.level===2 ? `pl-3.5` : `pl-6.5` }`}>
                            {anchor.textContent}
                        </Link>
                    </li>
                    ))
                }
            </ul>
        </div>
    )
}