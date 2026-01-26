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
import {FloatingMenu as FM} from '@tiptap/extension-floating-menu'
import {FloatingMenu} from '@tiptap/react/menus'
import InvisibleCharacters from '@tiptap/extension-invisible-characters'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import {getHierarchicalIndexes, TableOfContentData, TableOfContents} from '@tiptap/extension-table-of-contents'
import MenuBar from "./menuBar"
import { useActionState, useEffect, useMemo, useState } from "react";
import { ListBulletIcon, NumberedListIcon, PhotoIcon, TableCellsIcon } from "@heroicons/react/20/solid";
import Blockquote from "@tiptap/extension-blockquote";
import { updateTitle } from "../lib/actions";
import ToC from "./ToC";
import Messaging from "./messaging";
import { Message } from "../lib/definitions";

export default function Tiptap({fullname, token, docName, name, messages, userId} : {fullname: string, token: string, docName: string, name: string | undefined, messages: Message[] | undefined, userId: string}) { 
    function getRandomColor() {
        return Math.floor(Math.random()*255);
    } 

    const MyFontSize = FontSize.extend({
        addGlobalAttributes() {
            return [
                {
                    types: this.options.types,
                    attributes: {
                    fontSize: {
                        default: '16px',
                        parseHTML: element => element.style.fontSize,
                        renderHTML: attributes => {
                        if (!attributes.fontSize) {
                            return {}
                        }

                        return {
                            style: `font-size: ${attributes.fontSize}`,
                        }
                        },
                    },
                    },
                },
            ]
        },
    })

    const ydoc = useMemo(() => new Y.Doc(), []);

    const provider = useMemo(() => {
        return new HocuspocusProvider({
            url: process.env.NEXT_PUBLIC_HOCUSPOCUS_URL!,
            name: docName,
            document: ydoc,
            onConnect() {
                console.log("Client is connected to server");
            },
            onDisconnect() {
                console.log('Client is disconnected from server');
            },
            token
        })
    },[docName, ydoc, token])

    useEffect(() => {
        const indexeddb = new IndexeddbPersistence(docName, ydoc)

        indexeddb.on('synced', () => {
            console.log('Content from databse is synced!');
        })
    },[ydoc])

    const [title, setTitle] = useState(name);
    const [temp, setTemp] = useState(name)

    const [anchors, setAnchors] = useState<TableOfContentData | never>([]);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
            undoRedo: false,
            codeBlock: {
                enableTabIndentation: true,
                HTMLAttributes: {
                    class: 'mockup-code'
                }
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
                    HTMLAttributes: {
                        class: 'table rounded-box border border-black'
                    }
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
                            console.log(pasteContent)
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
            FM.configure({
               options: {
                placement: 'top',
                offset: 2,
               }
            }),
            FontFamily,
            MyFontSize,
            Gapcursor,
            InvisibleCharacters,
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
                    name: fullname,
                    color: `rgb(${getRandomColor()},${getRandomColor()},${getRandomColor()})`
                },
                render(user) {
                    const cursor = document.createElement('span')
                    cursor.classList.add(`relative`, `border-1`);
                    cursor.style.borderColor = user.color;

                    const label = document.createElement('span')
                    label.classList.add(`pointer-events-none`, `bottom-full`, `absolute`, `text-nowrap`, `text-base`, `font-normal`);
                    label.style.backgroundColor = user.color;
                    label.textContent = user.name;

                    cursor.insertBefore(label, null);
                    return cursor
                },
            })
        ],
        autofocus: true,
        editable: true,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: `h-full p-3 border-2 border-gray-400 rounded-sm`
            }
        }
    })

    const [state, formAction, isPending] = useActionState(updateTitle, undefined)

    useEffect(() => {
        if(!isPending) {
            if(state) {
                setTitle(temp)
            }
            else setTemp(title)
        }
    }, [state, isPending])

    return (
        <div className={`flex flex-col h-full min-h-max relative`}>
            <form action={formAction} className="flex justify-center mt-1 p-0.5" onSubmit={() => console.log('Submitted')}>
                <label className={`flex justify-center min-w-max min-h-max ${temp!==title ? `tooltip tooltip-error tooltip-right` : ``}`} data-tip={`Title is not synced to database: ${title}`}>
                    <input disabled={isPending} required type="text" name='title' className={`input text-center text-4xl font-bold min-w-max min-h-max ${temp!==title ? `input-error` : `input-ghost` }`} value={temp} onChange={(e) => {
                        const val = e.currentTarget.value;
                        console.log(val)

                        setTemp(val);
                    }}/>
                </label>
                <input type="text" hidden name='id' value={docName}/>
                <button className={`btn`} type="submit" disabled={isPending} hidden></button>
            </form>
            <MenuBar editor={editor}/>
            <div className="flex justify-center lg:grid lg:grid-cols-[1fr_auto_1fr] h-full min-h-max p-2 relative">               
                <ToC anchors={anchors} />
                    
                {
                    editor &&
                    <FloatingMenu editor={editor}>
                        <div data-testid='floating-menu'>
                            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`btn ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-300' : ''}`}>
                                H1
                            </button>

                            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`btn ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-300' : ''}`}>
                                H2
                            </button>

                            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`btn ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-300' : ''}`}>
                                H3
                            </button>

                            <button className={`btn tooltip ${editor.isActive('bulletList') ? `bg-blue-300` : ''}`} onClick={() => editor?.chain().focus().toggleBulletList().run()} data-tip='Bullet List'><ListBulletIcon width={20} height={20}/></button>

                            <button className={`btn tooltip ${editor.isActive('orderedList') ? `bg-blue-300` : ''}`} onClick={() => editor?.chain().focus().toggleOrderedList().run()} data-tip='Ordered List'><NumberedListIcon width={20} height={20}/></button>

                            <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={`btn tooltip ${editor.isActive('table') ? 'bg-blue-300' : ''}`} data-tip='Table'>
                                <TableCellsIcon width={25} height={20} />
                            </button>

                            <label className={`btn tooltip`} data-tip='Image'>
                                <PhotoIcon width={20} height={20} />
                                <input type="file" hidden accept="image/*" onChange={(e) => {
                                    const img = e.target.files ? e.target.files[0] : null;

                                    if(img) {
                                        const path = URL.createObjectURL(img);
                                        console.log(path)
                                        editor?.chain().focus().setImage({src: path}).run();
                                    }
                                }}/>
                            </label>
                        </div>
                    </FloatingMenu>
                }
                <EditorContent editor={editor} className={`prose border-none m-2 bg-base-300 text-base-content lg:min-w-2xl xl:min-w-4xl justify-self-center grow shrink-0 ` }/>
                <Messaging token={token} docName={docName} messages={messages} userId={userId}/>
            </div>
        </div>       
    )
}