export interface editorState {
    isBold: boolean,
    canBold: boolean,
    isItalic: boolean,
    canItalic: boolean,
    isUnderline: boolean,
    canUnderline: boolean,
    isStrike: boolean,
    canStrike: boolean,
    isBullet: boolean,
    canBullet: boolean,
    isOrdered: boolean,
    canOrdered: boolean,
    isCodeBlock: boolean,
    canCodeBlock: boolean,
    isH1: boolean,
    isH2: boolean,
    isH3: boolean,
    isParagraph: boolean,
    canImage: boolean,
    isTable: boolean,
    canInsertTable: boolean,
    background: string,
    canBackground: boolean,
    color: string,
    canColor: boolean,
    canTask: boolean,
    isSubscript: boolean,
    canSubscript: boolean,
    isSuperscript: boolean,
    canSuperscript: boolean,
    isTimesNew: boolean,
    isArial: boolean,
    fontSize: string,
    canFontSize: boolean,
    lineHeight: string,
    canLineHeight: boolean,
    isLeft: boolean,
    isRight: boolean,
    isCenter: boolean,
    isJustify: boolean,
    canAlign: boolean,
    isBlockquote: boolean,
    canBlockquote: boolean,
    canHorizontal: boolean,
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

export interface Memberships {
  fullName: string | null | undefined;
  userId: string | undefined;
  image: string | undefined;
  role: string
}