'use client'

import { EditorContent } from "@tiptap/react"
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit"
import {Dropcursor, Placeholder, Gapcursor, Selection} from '@tiptap/extensions';
import * as Y from "yjs";
import {HocuspocusProvider} from '@hocuspocus/provider'
import {Collaboration} from "@tiptap/extension-collaboration"
import {CollaborationCaret} from '@tiptap/extension-collaboration-caret'
import Image from '@tiptap/extension-image'
import {TableKit} from '@tiptap/extension-table'
import { TaskList, TaskItem } from "@tiptap/extension-list";
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { CharacterCount } from "@tiptap/extensions"
import {TextStyle, Color, BackgroundColor, FontFamily, FontSize, LineHeight} from '@tiptap/extension-text-style'
import {IndexeddbPersistence} from 'y-indexeddb'
import FileHandler from '@tiptap/extension-file-handler'
import InvisibleCharacters from '@tiptap/extension-invisible-characters'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import {getHierarchicalIndexes, TableOfContentData, TableOfContents} from '@tiptap/extension-table-of-contents'
import MenuBar from "./menuBar"
import { useEffect, useMemo, useRef, useState } from "react";
import Blockquote from "@tiptap/extension-blockquote";
import Link from "next/link";
import { ChevronLeft, ListTree, MessageCircle } from "lucide-react";
import ToC from "./ToC";
import Messaging from "./messaging";
import InsertMenu from "./insertMenu";
import DocTitle from "./docTitle";
import Presence from "./presence";
import ConnectionStatus from "./connectionStatus";
import { Message } from "../lib/definitions";
import { colorFor } from "../lib/collaborators";

export default function Tiptap({fullname, token, docName, name, messages, userId} : {fullname: string, token: string, docName: string, name: string | undefined, messages: Message[] | undefined, userId: string}) {
    const ydoc = useMemo(() => new Y.Doc(), []);

    const provider = useMemo(() => {
        return new HocuspocusProvider({
            url: process.env.NEXT_PUBLIC_HOCUSPOCUS_URL!,
            name: docName,
            document: ydoc,
            token
        })
    },[docName, ydoc, token])

    // Keeps a local copy so edits survive going offline.
    useEffect(() => {
        new IndexeddbPersistence(docName, ydoc)
    },[ydoc])

    const [anchors, setAnchors] = useState<TableOfContentData | never>([]);

    // On narrower screens the outline and chat open as drawers.
    const [panel, setPanel] = useState<'toc' | 'chat' | null>(null);
    const [unread, setUnread] = useState(0);
    const panelRef = useRef(panel);
    panelRef.current = panel;
    const tocRef = useRef<HTMLElement>(null);
    const chatRef = useRef<HTMLElement>(null);

    // Move focus into an opened drawer and give it back to the opener on close.
    useEffect(() => {
        if(!panel) return;

        const opener = document.activeElement as HTMLElement | null;
        (panel === 'toc' ? tocRef : chatRef).current?.focus();

        function onKeyDown(e: KeyboardEvent) {
            if(e.key === 'Escape') setPanel(null);
        }

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            opener?.focus();
        }
    }, [panel])

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
            undoRedo: false,
            codeBlock: {
                enableTabIndentation: true,
            },
            heading: {
                levels: [1,2,3]
            }
            }),
            Image.configure({
                resize: {
                    enabled: true,
                    directions: ["top", "right", "bottom", "left", "top-right", "top-left", "bottom-right", "bottom-left"],
                    minHeight: 50,
                    minWidth: 50,
                    alwaysPreserveAspectRatio: false
                },
                allowBase64: true
            }),
            TableKit.configure({
                table: {
                    resizable: true,
                    renderWrapper: true,
                    allowTableNodeSelection: true,
                }
            }),
            TaskList,
            TaskItem.configure({
                nested: true
            }),
            Subscript,
            Superscript,
            CharacterCount,
            TextStyle,
            Color,
            BackgroundColor,
            HorizontalRule,
            Dropcursor.configure({
                width: 2,
                color: 'var(--color-accent)',
            }),
            FileHandler.configure({
                allowedMimeTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                onDrop(editor, files, pos) {
                    files.forEach(file => {
                        const fileReader = new FileReader();

                        fileReader.readAsDataURL(file);
                        fileReader.onload = () => {
                            editor.chain().insertContentAt(pos, {
                                type: 'image',
                                attrs: {
                                    src: fileReader.result
                                }
                            }).focus().run();
                        }
                    })
                },
                onPaste(editor, files, pasteContent) {
                    files.forEach(file => {
                        if(pasteContent) {
                            return false;
                        }

                        const fileReader = new FileReader();

                        fileReader.readAsDataURL(file);
                        fileReader.onload = () => {
                            editor.chain().insertContentAt(editor.state.selection.anchor, {
                                type: 'image',
                                attrs: {
                                    src: fileReader.result
                                }
                            }).focus().run();
                        }
                    })
                },
            }),
            FontFamily,
            FontSize,
            Gapcursor,
            // Off by default; toggled from the toolbar's "More" menu.
            InvisibleCharacters.configure({
                visible: false,
            }),
            LineHeight,
            Selection,
            TextAlign.configure({
                types: ['heading', 'paragraph', 'table', 'blockquote'],
                defaultAlignment: 'left'
            }),
            Blockquote,
            TableOfContents.configure({
                getIndex: getHierarchicalIndexes,
                onUpdate: (anchors) => setAnchors(anchors),
                scrollParent: () => document.getElementById('doc-scroll') ?? window,
            }),
            Typography,
            Placeholder.configure({placeholder: "Start writing away...",}),
            Collaboration.configure({
                document: ydoc,
                provider: provider
            }),
            CollaborationCaret.configure({
                provider,
                user: {
                    name: fullname || 'Anonymous',
                    color: colorFor(userId),
                    userId,
                },
                render(user) {
                    const caret = document.createElement('span')
                    caret.classList.add('collab-caret');
                    caret.style.setProperty('--caret-color', user.color);

                    const label = document.createElement('span')
                    label.classList.add('collab-caret__label');
                    label.textContent = user.name;

                    caret.append(label);
                    return caret
                },
            })
        ],
        autofocus: true,
        editable: true,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: `focus:outline-none`
            }
        }
    })

    return (
        <div className="flex h-[calc(100dvh-4rem)] flex-col">
            <div className="shrink-0 border-b border-base-300 bg-base-100">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2.5 sm:px-5">
                    <div className="flex min-w-0 items-center gap-2">
                        <Link href="/dashboard" className="btn btn-ghost btn-sm btn-square tooltip tooltip-right" data-tip="Dashboard" aria-label="Back to dashboard">
                            <ChevronLeft className="size-5"/>
                        </Link>
                        <DocTitle id={docName} name={name}/>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <button type="button" className="btn btn-ghost btn-sm xl:hidden" aria-label="Outline" onClick={() => setPanel('toc')}>
                                <ListTree className="size-4"/>
                                <span className="max-md:hidden">Outline</span>
                            </button>
                            <button type="button" className="btn btn-ghost btn-sm relative lg:hidden" aria-label={unread ? `Chat, ${unread} unread` : 'Chat'} onClick={() => { setPanel('chat'); setUnread(0); }}>
                                <MessageCircle className="size-4"/>
                                <span className="max-md:hidden">Chat</span>
                                {unread > 0 && <span className="badge badge-accent badge-xs absolute -top-1 -right-1 tabular-nums">{unread > 9 ? '9+' : unread}</span>}
                            </button>
                        </div>
                        <Presence provider={provider} selfId={userId}/>
                        <ConnectionStatus provider={provider}/>
                    </div>
                </div>
                <MenuBar editor={editor}/>
            </div>

            <div className="flex min-h-0 flex-1">
                {panel &&
                    <div className={`fixed inset-0 z-40 bg-neutral/40 ${panel === 'toc' ? 'xl:hidden' : 'lg:hidden'}`} aria-hidden="true" onClick={() => setPanel(null)}/>
                }

                <aside ref={tocRef} tabIndex={-1} aria-label="Outline" className={`w-60 outline-none shrink-0 overflow-y-auto border-r border-base-300 bg-base-100 max-xl:fixed max-xl:inset-y-0 max-xl:left-0 max-xl:z-50 max-xl:w-72 max-xl:shadow-2xl max-xl:transition-[translate,visibility] max-xl:duration-200 ${panel === 'toc' ? '' : 'max-xl:invisible max-xl:-translate-x-full'}`}>
                    <ToC anchors={anchors} onNavigate={() => setPanel(null)} onClose={() => setPanel(null)}/>
                </aside>

                <main id="doc-scroll" className="min-w-0 flex-1 overflow-y-auto bg-base-200 px-3 py-6 sm:px-6 sm:py-10">
                    <article className="relative mx-auto max-w-204 rounded-box border border-base-300 bg-base-100 px-6 py-10 shadow-sm sm:px-14 sm:py-14">
                        {editor && <InsertMenu editor={editor}/>}
                        <EditorContent editor={editor} className="doc prose max-w-none"/>
                    </article>
                </main>

                <aside ref={chatRef} tabIndex={-1} aria-label="Chat" className={`flex w-80 outline-none shrink-0 border-l border-base-300 bg-base-100 2xl:w-88 max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-50 max-lg:w-[min(22rem,100vw)] max-lg:shadow-2xl max-lg:transition-[translate,visibility] max-lg:duration-200 ${panel === 'chat' ? '' : 'max-lg:invisible max-lg:translate-x-full'}`}>
                    <Messaging token={token} docName={docName} messages={messages} userId={userId} onClose={() => setPanel(null)} onIncoming={() => {
                        // The chat is always on screen from the lg breakpoint up.
                        if(panelRef.current !== 'chat' && !window.matchMedia('(min-width: 64rem)').matches) setUnread(n => n + 1);
                    }}/>
                </aside>
            </div>
        </div>
    )
}
