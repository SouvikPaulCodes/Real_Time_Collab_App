import { Database } from "@hocuspocus/extension-database"
import {Hocuspocus} from "@hocuspocus/server"
import jwt from 'jsonwebtoken'
import { AuthPayload } from "../lib/definitions.js";
import { prisma } from "./prisma.js";
import { findAccessibleWorkspace } from "./access.js";

export const hocuspocus = new Hocuspocus({
    timeout: 30000,
    debounce: 5000,
    maxDebounce: 30000,
    async onAuthenticate(data) {
        const {token} = data;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

            // Workspaces are created up front, so a missing one is never a new document
            const doc = await findAccessibleWorkspace(data.documentName, decoded);

            if(!doc) throw new Error('GTFO')

            console.log('Authorized')

            return {
                userId: decoded.userId,
                orgId: decoded.orgId || null
            }
        }
        catch(e: any) {
            throw new Error('Unauthorized')
        }
    },
    extensions: [
        new Database({
            async fetch(data) {
                const id = data.documentName;

                const content = await prisma.workspace.findUnique({
                    where: {
                        id: id
                    },
                    select: {
                        content: true
                    }
                })

                // A freshly created workspace has no Yjs state yet, and applying an empty update throws
                if(content && content.content.length > 0) return content.content;
                else return null;
            },
            async store(data) {
                const id = data.documentName;

                const binary = Buffer.from(data.state)

                await prisma.workspace.update({
                    where: {
                        id: id
                    },
                    data: {
                        content: binary
                    }
                })
            },
        })
    ]
})