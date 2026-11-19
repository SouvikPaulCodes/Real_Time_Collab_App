'use client'

import type { Editor } from "@tiptap/core"
import { useEditorState } from "@tiptap/react"
import { ReactNode, useEffect, useState } from "react";
import { ArrowDownToLine, ArrowLeftToLine, ArrowRightToLine, ArrowUpToLine, Baseline, Bold, Ellipsis, Highlighter, ImagePlus, Italic, List, ListChecks, ListOrdered, Minus, PanelLeft, PanelTop, Pilcrow, Plus, Redo2, RemoveFormatting, SeparatorHorizontal, Strikethrough, Subscript, Superscript, Table, TableCellsMerge, TableCellsSplit, TextAlignCenter, TextAlignEnd, TextAlignJustify, TextAlignStart, Trash2, Underline, Undo2 } from 'lucide-react'
import ToolbarMenu, { keepSelection, MenuDivider, MenuItem, MenuLabel } from "./toolbarMenu";
import { Alignment, BlockType, editorState } from "../lib/definitions";
import { readAsDataURL } from "../lib/images";

const BLOCKS: {value: BlockType, label: string, preview: string}[] = [
    {value: 'paragraph', label: 'Normal text', preview: 'text-sm'},
    {value: 'h1', label: 'Heading 1', preview: 'font-serif text-2xl'},
    {value: 'h2', label: 'Heading 2', preview: 'font-serif text-xl'},
    {value: 'h3', label: 'Heading 3', preview: 'font-serif text-lg'},
    {value: 'quote', label: 'Quote', preview: 'font-serif italic text-base border-l-2 border-accent pl-2'},
    {value: 'code', label: 'Code block', preview: 'font-mono text-xs'},
];

const FONTS: {label: string, value: string | undefined}[] = [
    {label: 'Default', value: undefined},
    {label: 'Times New Roman', value: 'Times New Roman'},
    {label: 'Arial', value: 'Arial'},
];

const ALIGNMENTS: {value: Alignment, label: string, icon: ReactNode}[] = [
    {value: 'left', label: 'Align left', icon: <TextAlignStart className="size-4"/>},
    {value: 'center', label: 'Align center', icon: <TextAlignCenter className="size-4"/>},
    {value: 'right', label: 'Align right', icon: <TextAlignEnd className="size-4"/>},
    {value: 'justify', label: 'Justify', icon: <TextAlignJustify className="size-4"/>},
];

const LINE_HEIGHTS: {label: string, value: string | undefined}[] = [
    {label: 'Default', value: undefined},
    {label: 'Single', value: '1'},
    {label: '1.15', value: '1.15'},
    {label: '1.5', value: '1.5'},
    {label: 'Double', value: '2'},
];

// Mid-tone colours so text stays readable on both the paper and ink themes.
const TEXT_COLORS = [
    {name: 'Red', value: '#E5484D'},
    {name: 'Orange', value: '#E8590C'},
    {name: 'Amber', value: '#B7791F'},
    {name: 'Green', value: '#2F9E44'},
    {name: 'Teal', value: '#0D9488'},
    {name: 'Blue', value: '#3E63DD'},
    {name: 'Purple', value: '#8E4EC6'},
    {name: 'Pink', value: '#D6409F'},
    {name: 'Grey', value: '#868E96'},
];

// Translucent so the text colour underneath shows through on either theme.
const HIGHLIGHTS = [
    {name: 'Yellow', value: '#FFD43B73'},
    {name: 'Orange', value: '#FF922B66'},
    {name: 'Red', value: '#FF6B6B59'},
    {name: 'Green', value: '#69DB7C59'},
    {name: 'Teal', value: '#38D9A959'},
    {name: 'Blue', value: '#4DABF759'},
    {name: 'Purple', value: '#9775FA59'},
    {name: 'Pink', value: '#F0659559'},
    {name: 'Grey', value: '#ADB5BD59'},
];

function useModKey() {
    const [mod, setMod] = useState('Ctrl');

    useEffect(() => {
        if(/Mac|iPhone|iPad/.test(navigator.userAgent)) setMod('⌘');
    }, [])

    return mod;
}

function setBlock(editor: Editor, block: BlockType, current: BlockType) {
    const chain = editor.chain().focus();

    if(current === 'quote' && block !== 'quote') chain.unsetBlockquote();

    if(block === 'paragraph') chain.setParagraph();
    else if(block === 'h1') chain.setHeading({level: 1});
    else if(block === 'h2') chain.setHeading({level: 2});
    else if(block === 'h3') chain.setHeading({level: 3});
    else if(block === 'quote') chain.setBlockquote();
    else chain.setCodeBlock();

    chain.run();
}

export default function MenuBar({editor}: {editor: Editor | null}) {
    const mod = useModKey();

    const state = useEditorState<editorState | null>({
        editor,
        selector: ({editor: e}) => {
            if(!e) return null;

            const textStyle = e.getAttributes('textStyle');

            return {
                canUndo: e.can().undo(),
                canRedo: e.can().redo(),
                block: e.isActive('codeBlock') ? 'code' :
                       e.isActive('heading', {level: 1}) ? 'h1' :
                       e.isActive('heading', {level: 2}) ? 'h2' :
                       e.isActive('heading', {level: 3}) ? 'h3' :
                       e.isActive('blockquote') ? 'quote' : 'paragraph',
                fontFamily: textStyle.fontFamily,
                fontSize: textStyle.fontSize,
                canFontSize: e.can().setFontSize('16px'),
                isBold: e.isActive('bold'),
                canBold: e.can().toggleBold(),
                isItalic: e.isActive('italic'),
                canItalic: e.can().toggleItalic(),
                isUnderline: e.isActive('underline'),
                canUnderline: e.can().toggleUnderline(),
                isStrike: e.isActive('strike'),
                canStrike: e.can().toggleStrike(),
                color: textStyle.color,
                canColor: e.can().setColor('#000000'),
                background: textStyle.backgroundColor,
                canBackground: e.can().setBackgroundColor('#000000'),
                isBullet: e.isActive('bulletList'),
                canBullet: e.can().toggleBulletList(),
                isOrdered: e.isActive('orderedList'),
                canOrdered: e.can().toggleOrderedList(),
                isTask: e.isActive('taskList'),
                canTask: e.can().toggleTaskList(),
                align: (['center', 'right', 'justify'] as const).find(a => e.isActive({textAlign: a})) ?? 'left',
                canAlign: e.can().setTextAlign('left'),
                canImage: e.can().setImage({src: '#'}),
                isTable: e.isActive('table'),
                canInsertTable: e.can().insertTable(),
                canHorizontal: e.can().setHorizontalRule(),
                isSubscript: e.isActive('subscript'),
                canSubscript: e.can().toggleSubscript(),
                isSuperscript: e.isActive('superscript'),
                canSuperscript: e.can().toggleSuperscript(),
                lineHeight: textStyle.lineHeight,
                canLineHeight: e.can().setLineHeight('1.5'),
                // The extension doesn't declare its storage type.
                showInvisibles: (e.storage as unknown as {invisibleCharacters?: {visibility: () => boolean}}).invisibleCharacters?.visibility() ?? false,
            }
        }
    });

    const block = state?.block ?? 'paragraph';
    const blockLabel = BLOCKS.find(b => b.value === block)!.label;
    const fontLabel = FONTS.find(f => f.value === state?.fontFamily)?.label ?? state?.fontFamily ?? 'Default';
    const size = parseInt(state?.fontSize ?? '') || 16;
    const align = ALIGNMENTS.find(a => a.value === (state?.align ?? 'left'))!;

    return (
        <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center justify-center gap-0.5 border-t border-base-300 px-2 py-1.5">
            <Tool label={`Undo (${mod}+Z)`} className="max-sm:hidden" disabled={!state?.canUndo} onClick={() => editor?.chain().focus().undo().run()}><Undo2 className="size-4"/></Tool>
            <Tool label={`Redo (${mod}+Shift+Z)`} className="max-sm:hidden" disabled={!state?.canRedo} onClick={() => editor?.chain().focus().redo().run()}><Redo2 className="size-4"/></Tool>

            <Separator className="max-sm:hidden"/>

            <ToolbarMenu label="Text style" disabled={!editor} trigger={<span className="w-20 truncate text-left text-sm">{blockLabel}</span>}>
                {close => BLOCKS.map(b => (
                    <MenuItem key={b.value} active={block === b.value} onSelect={() => { if(editor) setBlock(editor, b.value, block); close(); }}>
                        <span className={b.preview}>{b.label}</span>
                    </MenuItem>
                ))}
            </ToolbarMenu>

            <ToolbarMenu label="Font" disabled={!editor} wrapperClassName="hidden md:block" trigger={<span className="w-16 truncate text-left text-sm" style={{fontFamily: state?.fontFamily}}>{fontLabel}</span>}>
                {close => FONTS.map(f => (
                    <MenuItem key={f.label} active={state?.fontFamily === f.value} onSelect={() => {
                        if(f.value) editor?.chain().focus().setFontFamily(f.value).run();
                        else editor?.chain().focus().unsetFontFamily().run();
                        close();
                    }}>
                        <span style={{fontFamily: f.value}}>{f.label}</span>
                    </MenuItem>
                ))}
            </ToolbarMenu>

            <FontSize value={size} disabled={!state?.canFontSize} onChange={n => editor?.chain().focus().setFontSize(`${n}px`).run()}/>

            <Separator/>

            <Tool label={`Bold (${mod}+B)`} active={state?.isBold} disabled={!state?.canBold} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="size-4"/></Tool>
            <Tool label={`Italic (${mod}+I)`} active={state?.isItalic} disabled={!state?.canItalic} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="size-4"/></Tool>
            <Tool label={`Underline (${mod}+U)`} active={state?.isUnderline} disabled={!state?.canUnderline} onClick={() => editor?.chain().focus().toggleUnderline().run()}><Underline className="size-4"/></Tool>
            <Tool label={`Strikethrough (${mod}+Shift+S)`} active={state?.isStrike} disabled={!state?.canStrike} onClick={() => editor?.chain().focus().toggleStrike().run()}><Strikethrough className="size-4"/></Tool>

            <ColorMenu label="Text color" icon={<Baseline className="size-4"/>} colors={TEXT_COLORS} current={state?.color} disabled={!state?.canColor}
                onPick={(color, focus) => focus ? editor?.chain().focus().setColor(color).run() : editor?.chain().setColor(color).run()}
                onClear={() => editor?.chain().focus().unsetColor().run()}/>
            <ColorMenu label="Highlight" icon={<Highlighter className="size-4"/>} colors={HIGHLIGHTS} current={state?.background} disabled={!state?.canBackground}
                onPick={(color, focus) => focus ? editor?.chain().focus().setBackgroundColor(color).run() : editor?.chain().setBackgroundColor(color).run()}
                onClear={() => editor?.chain().focus().unsetBackgroundColor().run()}/>

            <Separator/>

            <Tool label="Bullet list" active={state?.isBullet} disabled={!state?.canBullet} onClick={() => editor?.chain().focus().toggleBulletList().run()}><List className="size-4"/></Tool>
            <Tool label="Numbered list" active={state?.isOrdered} disabled={!state?.canOrdered} onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered className="size-4"/></Tool>
            <Tool label="Task list" active={state?.isTask} disabled={!state?.canTask} onClick={() => editor?.chain().focus().toggleTaskList().run()}><ListChecks className="size-4"/></Tool>

            <ToolbarMenu label="Alignment" disabled={!state?.canAlign} className="px-1.5" trigger={align.icon}>
                {close => ALIGNMENTS.map(a => (
                    <MenuItem key={a.value} icon={a.icon} active={state?.align === a.value} onSelect={() => { editor?.chain().focus().setTextAlign(a.value).run(); close(); }}>
                        {a.label}
                    </MenuItem>
                ))}
            </ToolbarMenu>

            <Separator/>

            <ImageButton editor={editor} disabled={!state?.canImage}/>

            <ToolbarMenu label="Table" disabled={!editor || (!state?.isTable && !state?.canInsertTable)} className={`px-1.5 ${state?.isTable ? 'text-accent' : ''}`} trigger={<Table className="size-4"/>}>
                {close => state?.isTable ?
                    <TableActions editor={editor!} close={close}/>
                    : <TableSizePicker onPick={(rows, cols) => { editor?.chain().focus().insertTable({rows, cols, withHeaderRow: true}).run(); close(); }}/>
                }
            </ToolbarMenu>

            <Tool label="Divider" disabled={!state?.canHorizontal} onClick={() => editor?.chain().focus().setHorizontalRule().run()}><SeparatorHorizontal className="size-4"/></Tool>

            <Separator/>

            <ToolbarMenu label="More" align="end" disabled={!editor} className="px-1.5" trigger={<Ellipsis className="size-4"/>}>
                {close => (
                    <>
                        <MenuItem icon={<Subscript className="size-4"/>} active={state?.isSubscript} disabled={!state?.canSubscript} onSelect={() => { editor?.chain().focus().toggleSubscript().run(); close(); }}>Subscript</MenuItem>
                        <MenuItem icon={<Superscript className="size-4"/>} active={state?.isSuperscript} disabled={!state?.canSuperscript} onSelect={() => { editor?.chain().focus().toggleSuperscript().run(); close(); }}>Superscript</MenuItem>
                        <MenuDivider/>
                        <MenuLabel>Line spacing</MenuLabel>
                        {LINE_HEIGHTS.map(l => (
                            <MenuItem key={l.label} active={state?.lineHeight === l.value} disabled={!state?.canLineHeight} onSelect={() => {
                                if(l.value) editor?.chain().focus().setLineHeight(l.value).run();
                                else editor?.chain().focus().unsetLineHeight().run();
                                close();
                            }}>{l.label}</MenuItem>
                        ))}
                        <MenuDivider/>
                        <MenuItem icon={<Pilcrow className="size-4"/>} active={state?.showInvisibles} onSelect={() => { editor?.chain().focus().toggleInvisibleCharacters().run(); close(); }}>Show formatting marks</MenuItem>
                        <MenuItem icon={<RemoveFormatting className="size-4"/>} onSelect={() => { editor?.chain().focus().unsetAllMarks().run(); close(); }}>Clear formatting</MenuItem>
                    </>
                )}
            </ToolbarMenu>
        </div>
    )
}

function Tool({label, active, disabled, onClick, className = '', children}: {label: string, active?: boolean, disabled?: boolean, onClick: () => void, className?: string, children: ReactNode}) {
    return (
        <button type="button" aria-label={label} aria-pressed={active} data-tip={label} disabled={disabled} onMouseDown={keepSelection} onClick={onClick}
            className={`btn btn-ghost btn-sm btn-square tooltip tooltip-bottom ${active ? 'bg-base-300' : ''} ${className}`}>
            {children}
        </button>
    )
}

function Separator({className = ''}: {className?: string}) {
    return <div className={`mx-0.5 h-5 w-px shrink-0 bg-base-300 ${className}`} aria-hidden="true"/>
}

export function ImageButton({editor, disabled, tooltip = 'tooltip-bottom'}: {editor: Editor | null, disabled?: boolean, tooltip?: string}) {
    return (
        <label aria-label="Insert image" data-tip="Image" onMouseDown={keepSelection} className={`btn btn-ghost btn-sm btn-square tooltip ${tooltip} ${disabled ? 'btn-disabled' : ''}`}>
            <ImagePlus className="size-4"/>
            <input type="file" accept="image/*" className="hidden" disabled={disabled} onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = '';

                if(!file || !editor) return;

                const src = await readAsDataURL(file);
                editor.chain().focus().setImage({src}).run();
            }}/>
        </label>
    )
}

function FontSize({value, disabled, onChange}: {value: number, disabled: boolean, onChange: (size: number) => void}) {
    const [draft, setDraft] = useState<string | null>(null);

    function commit() {
        if(draft === null) return;

        const size = parseInt(draft);
        if(size >= 1 && size <= 200) onChange(size);

        setDraft(null);
    }

    return (
        <div className="tooltip tooltip-bottom hidden h-8 items-center rounded-field border border-base-300 md:flex" data-tip="Font size">
            <button type="button" aria-label="Decrease font size" className="btn btn-ghost btn-xs btn-square" disabled={disabled || value <= 1} onMouseDown={keepSelection} onClick={() => onChange(value - 1)}>
                <Minus className="size-3"/>
            </button>
            <input type="text" inputMode="numeric" aria-label="Font size" disabled={disabled} value={draft ?? value}
                className="w-7 bg-transparent text-center text-sm tabular-nums outline-none disabled:opacity-40"
                onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
                onBlur={commit}
                onKeyDown={(e) => {
                    if(e.key === 'Enter') {
                        e.preventDefault();
                        commit();
                    }
                    if(e.key === 'Escape') setDraft(null);
                }}/>
            <button type="button" aria-label="Increase font size" className="btn btn-ghost btn-xs btn-square" disabled={disabled || value >= 200} onMouseDown={keepSelection} onClick={() => onChange(value + 1)}>
                <Plus className="size-3"/>
            </button>
        </div>
    )
}

function ColorMenu({label, icon, colors, current, disabled, onPick, onClear}: {
    label: string,
    icon: ReactNode,
    colors: {name: string, value: string}[],
    current: string | undefined,
    disabled: boolean,
    onPick: (color: string, focus: boolean) => void,
    onClear: () => void,
}) {
    const isCurrent = (value: string) => current?.toLowerCase() === value.toLowerCase();

    return (
        <ToolbarMenu label={label} disabled={disabled} className="px-1.5" trigger={
            <span className="flex flex-col items-center">
                {icon}
                <span className="mt-0.5 h-0.75 w-4 rounded-full" style={{backgroundColor: current ?? 'currentColor', opacity: current ? 1 : 0.2}}/>
            </span>
        }>
            {close => (
                <div className="w-52 p-1.5">
                    <div className="grid grid-cols-5 gap-1.5">
                        <button type="button" aria-label="Default" title="Default" onMouseDown={keepSelection} onClick={() => { onClear(); close(); }}
                            className={`relative size-8 overflow-hidden rounded-field border border-base-content/15 bg-base-100 ${!current ? 'ring-2 ring-accent ring-offset-2 ring-offset-base-100' : ''}`}>
                            <span className="absolute top-1/2 left-1/2 h-0.5 w-10 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-error"/>
                        </button>
                        {colors.map(c => (
                            <button key={c.value} type="button" aria-label={c.name} title={c.name} onMouseDown={keepSelection} onClick={() => { onPick(c.value, true); close(); }}
                                className={`size-8 rounded-field border border-base-content/10 ${isCurrent(c.value) ? 'ring-2 ring-accent ring-offset-2 ring-offset-base-100' : ''}`}
                                style={{backgroundColor: c.value}}/>
                        ))}
                    </div>
                    <MenuDivider/>
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-field px-2.5 py-1.5 text-sm hover:bg-base-200">
                        <span className="size-4 rounded-full border border-base-content/20" style={{background: 'conic-gradient(#f43f5e, #f59e0b, #84cc16, #06b6d4, #6366f1, #d946ef, #f43f5e)'}}/>
                        Custom color…
                        <input type="color" className="sr-only" value={/^#[0-9a-f]{6}$/i.test(current ?? '') ? current : '#000000'} onChange={(e) => onPick(e.target.value, false)}/>
                    </label>
                </div>
            )}
        </ToolbarMenu>
    )
}

function TableSizePicker({onPick}: {onPick: (rows: number, cols: number) => void}) {
    const [hover, setHover] = useState({rows: 0, cols: 0});

    return (
        <div className="p-1.5">
            <div className="grid grid-cols-6 gap-1" onMouseLeave={() => setHover({rows: 0, cols: 0})}>
                {Array.from({length: 36}, (_, i) => {
                    const rows = Math.floor(i / 6) + 1;
                    const cols = (i % 6) + 1;
                    const on = rows <= hover.rows && cols <= hover.cols;

                    return (
                        <button key={i} type="button" aria-label={`${rows} by ${cols} table`} onMouseDown={keepSelection} onMouseEnter={() => setHover({rows, cols})} onFocus={() => setHover({rows, cols})} onClick={() => onPick(rows, cols)}
                            className={`size-5 rounded-sm border transition-colors ${on ? 'border-accent bg-accent/20' : 'border-base-300 bg-base-200'}`}/>
                    )
                })}
            </div>
            <div className="mt-2 text-center text-xs tabular-nums opacity-60">
                {hover.rows ? `${hover.rows} × ${hover.cols}` : 'Insert table'}
            </div>
        </div>
    )
}

function TableActions({editor, close}: {editor: Editor, close: () => void}) {
    const act = (fn: () => boolean) => () => { fn(); close(); };

    return (
        <div className="w-56">
            <MenuLabel>Rows</MenuLabel>
            <MenuItem icon={<ArrowUpToLine className="size-4"/>} onSelect={act(() => editor.chain().focus().addRowBefore().run())}>Insert row above</MenuItem>
            <MenuItem icon={<ArrowDownToLine className="size-4"/>} onSelect={act(() => editor.chain().focus().addRowAfter().run())}>Insert row below</MenuItem>
            <MenuItem icon={<Trash2 className="size-4"/>} onSelect={act(() => editor.chain().focus().deleteRow().run())}>Delete row</MenuItem>
            <MenuDivider/>
            <MenuLabel>Columns</MenuLabel>
            <MenuItem icon={<ArrowLeftToLine className="size-4"/>} onSelect={act(() => editor.chain().focus().addColumnBefore().run())}>Insert column left</MenuItem>
            <MenuItem icon={<ArrowRightToLine className="size-4"/>} onSelect={act(() => editor.chain().focus().addColumnAfter().run())}>Insert column right</MenuItem>
            <MenuItem icon={<Trash2 className="size-4"/>} onSelect={act(() => editor.chain().focus().deleteColumn().run())}>Delete column</MenuItem>
            <MenuDivider/>
            <MenuLabel>Cells</MenuLabel>
            <MenuItem icon={<TableCellsMerge className="size-4"/>} onSelect={act(() => editor.chain().focus().mergeCells().run())}>Merge cells</MenuItem>
            <MenuItem icon={<TableCellsSplit className="size-4"/>} onSelect={act(() => editor.chain().focus().splitCell().run())}>Split cell</MenuItem>
            <MenuItem icon={<PanelTop className="size-4"/>} onSelect={act(() => editor.chain().focus().toggleHeaderRow().run())}>Toggle header row</MenuItem>
            <MenuItem icon={<PanelLeft className="size-4"/>} onSelect={act(() => editor.chain().focus().toggleHeaderColumn().run())}>Toggle header column</MenuItem>
            <MenuItem onSelect={act(() => editor.chain().focus().toggleHeaderCell().run())}>Toggle header cell</MenuItem>
            <MenuDivider/>
            <MenuItem danger icon={<Trash2 className="size-4"/>} onSelect={act(() => editor.chain().focus().deleteTable().run())}>Delete table</MenuItem>
        </div>
    )
}
