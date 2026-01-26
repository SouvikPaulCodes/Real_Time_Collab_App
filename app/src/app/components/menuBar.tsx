'use client'

import type { Editor } from "@tiptap/core"
import { useEditorState } from "@tiptap/react"
import { ListBulletIcon, CodeBracketSquareIcon, NumberedListIcon, PhotoIcon, TableCellsIcon, PaintBrushIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import {AlignVerticalSpaceAround, CaseSensitive, ListChecks, ListChevronsDownUp, Minus, Subscript, Superscript, TextAlignCenter, TextAlignEnd, TextAlignJustify, TextAlignJustifyIcon, TextAlignStart, TextQuote, TypeIcon} from 'lucide-react'
import { useEffect, useState } from "react";
import { editorState } from "../lib/definitions";

export default function MenuBar({editor}: {editor: Editor | null}) {
    const editorState = useEditorState<editorState | null>({
        editor,
        selector: ctx => {
            return {
                isBold: ctx.editor?.isActive('bold') ?? false,
                canBold: ctx.editor?.can().toggleBold() ?? false,
                isItalic: ctx.editor?.isActive('italic') ?? false,
                canItalic: ctx.editor?.can().toggleItalic() ?? false,
                isUnderline: ctx.editor?.isActive('underline') ?? false,
                canUnderline: ctx.editor?.can().toggleUnderline() ?? false,
                isStrike: ctx.editor?.isActive('strike') ?? false,
                canStrike: ctx.editor?.can().toggleStrike() ?? false,
                isBullet: ctx.editor?.isActive('bulletList') ?? false,
                canBullet: ctx.editor?.can().toggleBulletList() ?? false,
                isOrdered: ctx.editor?.isActive('orderedList') ?? false,
                canOrdered: ctx.editor?.can().toggleOrderedList() ?? false,
                isCodeBlock: ctx.editor?.isActive('codeBlock') ?? false,
                canCodeBlock: ctx.editor?.can().toggleCodeBlock() ?? false,
                isH1: ctx.editor?.isActive('heading', {level: 1}) ?? false,
                isH2: ctx.editor?.isActive('heading', {level: 2}) ?? false,
                isH3: ctx.editor?.isActive('heading', {level: 3}) ?? false,
                isParagraph: ctx.editor?.isActive('paragraph') ?? false,
                canImage: ctx.editor?.can().setImage({src: '#'}) ?? false,
                isTable: ctx.editor?.isActive('table') ?? false,
                canInsertTable: ctx.editor?.can().insertTable() ?? false,
                background: ctx.editor?.getAttributes('textStyle').backgroundColor,
                canBackground: ctx.editor?.can().setBackgroundColor('black') ?? false,
                color: ctx.editor?.getAttributes('textStyle').color,
                canColor: ctx.editor?.can().setColor('black') ?? false,
                canTask: ctx.editor?.can().toggleTaskList() ?? false,
                isSubscript: ctx.editor?.isActive('subscript') ?? false,
                canSubscript: ctx.editor?.can().toggleSubscript() ?? false,
                isSuperscript: ctx.editor?.isActive('superscript') ?? false,
                canSuperscript: ctx.editor?.can().toggleSuperscript() ?? false,
                isTimesNew: ctx.editor?.isActive('textStyle', {fontFamily: `Times New Roman`}) ?? false,
                isArial: ctx.editor?.isActive('textStyle', {fontFamily: `Arial`}) ?? false,
                fontSize: ctx.editor?.getAttributes('textStyle').fontSize,
                canFontSize: ctx.editor?.can().setFontSize('32px') ?? false,
                lineHeight: ctx.editor?.getAttributes('textStyle').lineHeight,
                canLineHeight: ctx.editor?.can().setLineHeight('1.0') ?? false,
                isLeft: ctx.editor?.isActive({textAlign: 'left'}) ?? false,
                isRight: ctx.editor?.isActive({textAlign: 'right'}) ?? false,
                isCenter: ctx.editor?.isActive({textAlign: 'center'}) ?? false,
                isJustify: ctx.editor?.isActive({textAlign: 'justify'}) ?? false,
                canAlign: ctx.editor?.can().toggleTextAlign('left') ?? false,
                isBlockquote: ctx.editor?.isActive('blockquote') ?? false,
                canBlockquote: ctx.editor?.can().toggleBlockquote() ?? false,
                canHorizontal: ctx.editor?.can().setHorizontalRule() ?? false,
            }
        }
    });

    const heading = editorState?.isH1 ? `H1` : 
                    editorState?.isH2 ? `H2` :
                    editorState?.isH3 ? `H3` : `Para`;

    const font = editorState?.isTimesNew ? `timesNew` :
                 editorState?.isArial ? `arial` : `default`;
   

    const size = editorState?.fontSize?.slice(0,-2) || '16';

    const line = editorState?.lineHeight || '0';

    return (
        <div className={`p-2 border-2 border-blue-400 bg-gray-300 flex m-2 sticky top-1 z-2 flex-wrap justify-center rounded-r-full rounded-l-full`}>
            <div className="basic flex border-r border-r-neutral pr-2.5 gap-1">
                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isBold ? `font-black` : `font-normal`}`} onClick={() => editor?.chain().focus().toggleBold().run()} disabled={!editorState?.canBold} data-tip='Bold'>B</button>

                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isItalic ? `italic` : `not-italic`} font-normal`} onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={!editorState?.canItalic} data-tip='Italic'>I</button>

                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isUnderline ? `underline` : `no-underline`} font-normal`} onClick={() => editor?.chain().focus().toggleUnderline().run()} disabled={!editorState?.canUnderline} data-tip='Underline'>U</button>

                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isStrike ? `line-through` : ``} font-normal`} onClick={() => editor?.chain().focus().toggleStrike().run()} disabled={!editorState?.canStrike} data-tip='Strike-through'>S</button>

                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isSubscript ? `bg-blue-300` : ''}`} onClick={() => editor?.chain().focus().toggleSubscript().run()} disabled={!editorState?.canSubscript} data-tip='Subscript'><Subscript width={20} height={20}/></button>

                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isSuperscript ? `bg-blue-300` : ''}`} onClick={() => editor?.chain().focus().toggleSuperscript().run()} disabled={!editorState?.canSuperscript} data-tip='Superscript'><Superscript width={20} height={20}/></button>
            </div>

            <div className="flex insert border-r pl-2.5 pr-2.5 gap-1 border-r-neutral">
                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isCodeBlock ? `bg-blue-300` : ''}`} onClick={() => editor?.chain().focus().toggleCodeBlock().run()} disabled={!editorState?.canCodeBlock} data-tip='Code Block'><CodeBracketSquareIcon width={20} height={20}/></button>

                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isBlockquote ? `bg-blue-300` : ``}`} data-tip='Blockquote' disabled={!editorState?.canBlockquote} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
                    <TextQuote width={20} height={20} />
                </button>

                <label className={`btn tooltip tooltip-bottom bg-base-100 ${!editorState?.canImage ? `pointer-events-none` : `pointer-events-auto`}`} data-tip='Image'>
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

                <div className={editorState?.isTable ? `dropdown dropdown-end dropdown-hover bg-blue-300` : ``}>
                    <div tabIndex={0} role={`button`}className={`btn tooltip tooltip-bottom bg-base-100 ${!editorState?.canInsertTable && `pointer-events-none`}`} data-tip='Table' onClick={() => editor?.chain().focus().insertTable({rows: 3, cols: 3, withHeaderRow: true}).run()}>
                        <TableCellsIcon width={25} height={20}/>
                    </div>
                    {editorState?.isTable ?
                        <ul tabIndex={-1} className='menu dropdown-content rounded-box z-1 w-52 p-2 shadow-sm bg-base-100'>
                            <li onClick={() => editor?.chain().focus().addColumnBefore().run()}><button className="btn">Add Column Before</button></li>
                            <li onClick={() => editor?.chain().focus().addColumnAfter().run()}><button className="btn">Add Column After</button></li> 
                            <li onClick={() => editor?.chain().focus().addRowBefore().run()}><button className="btn">Add Row Before</button></li>
                            <li onClick={() => editor?.chain().focus().addRowAfter().run()}><button className="btn">Add Row After</button></li>
                            <li onClick={() => editor?.chain().focus().mergeCells().run()}><button className="btn">Merge Cells</button></li>
                            <li onClick={() => editor?.chain().focus().splitCell().run()}><button className="btn">Split Cell</button></li>
                            <li onClick={() => editor?.chain().focus().toggleHeaderColumn().run()}><button className="btn">Toggle Header Column</button></li>
                            <li onClick={() => editor?.chain().focus().toggleHeaderRow().run()}><button className="btn">Toggle Header Row</button></li>
                            <li onClick={() => editor?.chain().focus().toggleHeaderCell().run()}><button className="btn">Toggle Header Cell</button></li>
                            <li onClick={() => editor?.chain().focus().deleteColumn().run()}><button className="btn">Delete Column</button></li>
                            <li onClick={() => editor?.chain().focus().deleteRow().run()}><button className="btn">Delete Row</button></li>
                            <li onClick={() => editor?.chain().focus().deleteTable().run()}><button className="btn">Delete Table</button></li>
                        </ul>
                        :
                        null
                    }
                </div>
            </div>

            <div className="styling flex border-r pl-2.5 pr-2.5 gap-1 border-r-neutral">
                <button disabled={!editorState?.canBackground} className={`btn tooltip tooltip-bottom bg-base-100 flex flex-col items-stretch p-1 pb-0 min-w-max`} data-tip='Background Color'>
                    <PaintBrushIcon color={editorState?.background} width={30} height={20} onClick={(e) => {
                        if(!editorState?.background) editor?.chain().focus().setBackgroundColor(editorState?.background || 'black').run();
                        else editor?.chain().focus().unsetBackgroundColor().run();
                    }}/>
                    <label className="flex justify-center border-t">
                        <ChevronDownIcon width={15} height={10}/>
                        <input type="color" hidden onChange={(e) => {
                            const color = e.target.value;

                            editor?.chain().focus().setBackgroundColor(color).run();               
                        }}/>
                    </label>                
                </button>

                <button disabled={!editorState?.canColor} className={`btn tooltip tooltip-bottom bg-base-100 flex flex-col items-stretch p-1 pb-0 min-w-max`} data-tip='Text Color'>
                    <CaseSensitive aria-hidden={false} color={editorState?.color} width={30} height={20} onClick={(e) => {
                        if(!editorState?.color) editor?.chain().focus().setColor(editorState?.color || `black`).run();
                        else editor?.chain().focus().unsetColor().run();
                    }}/>
                    <label className="flex justify-center border-t">
                        <ChevronDownIcon width={15} height={10}/>
                        <input type="color" hidden onChange={(e) => {
                            const color = e.target.value;

                            editor?.chain().focus().setColor(color).run();               
                        }}/>
                    </label>                
                </button>

                <select className="select tooltip tooltip-bottom w-40 bg-base-100" data-tip='Font Family' name="font" id="font" value={font} onChange={(e) => {
                    const value = e.target.value;

                    console.log(`font:`, font, ` value:`, value);
                    
                    if(value==='timesNew') editor?.chain().focus().setFontFamily(`Times New Roman`).run();
                    else if(value==='arial') editor?.chain().focus().setFontFamily(`Arial`).run();
                    else editor?.chain().focus().unsetFontFamily().run();
                    }
                }>
                    <option value="default">Default</option>
                    <option value="timesNew">Times New Roman</option>
                    <option value="arial">Arial</option>
                </select>

                <label className="input tooltip tooltip-bottom w-30 bg-base-100" data-tip='Font Size'>
                    <TypeIcon width={15} height={15}/>
                    <input type="number" min={'1'} disabled={!editorState?.canFontSize} value={size} onInput={(e) => {
                        const size = e.currentTarget.value;

                        editor?.chain().setFontSize(`${size}px`).run();
                        console.log('input size:', editorState?.fontSize)
                    }}/>
                </label>
            </div>

            <div className="level flex border-r pl-2.5 pr-2.5 gap-1 border-r-neutral">
                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isBullet ? `bg-blue-300` : ''}`} onClick={() => editor?.chain().focus().toggleBulletList().run()} disabled={!editorState?.canBullet} data-tip='Bullet List'><ListBulletIcon width={20} height={20}/></button>

                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isOrdered ? `bg-blue-300` : ''}`} onClick={() => editor?.chain().focus().toggleOrderedList().run()} disabled={!editorState?.canOrdered} data-tip='Ordered List'><NumberedListIcon width={20} height={20}/></button>

                <select className="select tooltip tooltip-bottom w-40 bg-base-100" data-tip='Text Levels' name="levels" id="levels" value={heading} onChange={(e) => {
                    const value = e.target.value;

                    console.log(`heading:`, heading, ` value:`, value);
                    
                    if(value==='H1') editor?.chain().focus().setHeading({level: 1}).run();
                    else if(value==='H2') editor?.chain().focus().setHeading({level: 2}).run();
                    else if(value==='H3') editor?.chain().focus().setHeading({level: 3}).run();
                    else editor?.chain().focus().setParagraph().run();
                    }
                }>
                    <option value="H1">Heading 1</option>
                    <option value="H2">Heading 2</option>
                    <option value="H3">Heading 3</option>
                    <option value="Para">Normal text</option>
                </select>

                <button className={`btn tooltip tooltip-bottom bg-base-100 `} onClick={() => editor?.chain().focus().toggleTaskList().run()} disabled={!editorState?.canTask} data-tip='Task List'><ListChecks width={20} height={20}/></button>
            </div>

            <div className="align flex pl-2.5 gap-1 border-r-neutral">
                <button className={`btn tooltip tooltip-bottom bg-base-100`} data-tip='Horizontal Rule' disabled={!editorState?.canHorizontal} onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
                    <Minus width={20} height={20} />
                </button>

                <label className="input tooltip tooltip-bottom w-30 bg-base-100" data-tip='Line Height'>
                    <AlignVerticalSpaceAround width={20} height={20}/>
                    <input type="number" min={'0'} disabled={!editorState?.canLineHeight} value={line} onInput={(e) => {
                        const line = e.currentTarget.value;

                        if(line==='0' || line==='0.0') {
                            editor?.chain().unsetLineHeight().run();
                            return;
                        }

                        editor?.chain().setLineHeight(line).run();
                        console.log('line height:', editorState?.lineHeight)
                    }}/>
                </label>

                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isLeft ? `bg-blue-300` : ``}`} data-tip='Align Left' disabled={!editorState?.canAlign} onClick={() => editor?.chain().focus().toggleTextAlign('left').run()}>
                    <TextAlignStart width={20} height={20} />
                </button>

                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isCenter ? `bg-blue-300` : ``}`} data-tip='Align Center' disabled={!editorState?.canAlign} onClick={() => editor?.chain().focus().toggleTextAlign('center').run()}>
                    <TextAlignCenter width={20} height={20} />
                </button>

                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isRight ? `bg-blue-300` : ``}`} data-tip='Align Right' disabled={!editorState?.canAlign} onClick={() => editor?.chain().focus().toggleTextAlign('right').run()}>
                    <TextAlignEnd width={20} height={20} />
                </button>

                <button className={`btn tooltip tooltip-bottom bg-base-100 ${editorState?.isJustify ? `bg-blue-300` : ``}`} data-tip='Align Justify' disabled={!editorState?.canAlign} onClick={() => editor?.chain().focus().toggleTextAlign('justify').run()}>
                    <TextAlignJustify width={20} height={20} />
                </button>
            </div>                   
        </div>
    )
}