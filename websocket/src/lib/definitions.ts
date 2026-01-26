import type { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
    userId: string,
    orgId: string | undefined,
    id: string | undefined
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

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}