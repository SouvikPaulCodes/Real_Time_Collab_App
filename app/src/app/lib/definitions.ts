export type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'quote' | 'code';
export type Alignment = 'left' | 'center' | 'right' | 'justify';

export interface editorState {
    canUndo: boolean,
    canRedo: boolean,
    block: BlockType,
    fontFamily: string | undefined,
    fontSize: string | undefined,
    canFontSize: boolean,
    isBold: boolean,
    canBold: boolean,
    isItalic: boolean,
    canItalic: boolean,
    isUnderline: boolean,
    canUnderline: boolean,
    isStrike: boolean,
    canStrike: boolean,
    color: string | undefined,
    canColor: boolean,
    background: string | undefined,
    canBackground: boolean,
    isBullet: boolean,
    canBullet: boolean,
    isOrdered: boolean,
    canOrdered: boolean,
    isTask: boolean,
    canTask: boolean,
    align: Alignment,
    canAlign: boolean,
    canImage: boolean,
    isTable: boolean,
    canInsertTable: boolean,
    canHorizontal: boolean,
    isSubscript: boolean,
    canSubscript: boolean,
    isSuperscript: boolean,
    canSuperscript: boolean,
    lineHeight: string | undefined,
    canLineHeight: boolean,
    showInvisibles: boolean,
}

export interface Project {
    id: string,
    name: string,
    userID: string,
    createdAt: string,
    updatedAt: string
}

export interface Message {
    id: string,
    content: string,
    senderId: string,
    createdAt: string,
}

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  message: ({id, content, senderId, createdAt}: {id: string, content: string, senderId: string, createdAt: string}) => void
}

export interface ClientToServerEvents {
  message: ({content, senderId, workspaceId}: {content: string, senderId: string, workspaceId: string}) => void
}
