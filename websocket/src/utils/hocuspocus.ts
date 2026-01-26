import { Database } from "@hocuspocus/extension-database"
import {Server} from "@hocuspocus/server"
import jwt from 'jsonwebtoken'
import { AuthPayload } from "../lib/definitions.js";
import { prisma } from "./prisma.js";

export const server = new Server({
    port: 9876,
    timeout: 30000,
    debounce: 5000,
    maxDebounce: 30000,
    async onAuthenticate(data) {
        const {token} = data;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

            const id = data.documentName;

            const doc = await prisma.workspace.findUnique({
                where: {id}
            })

            if(doc && (doc?.userID!==decoded.userId && doc?.orgID!==decoded.orgId)) throw new Error('GTFO')

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

                if(content) return content?.content;
                else return null;
            },
            async store(data) {
                const {userId, orgId} = data.context as {
                    userId: string,
                    orgId: string | null
                }

                const id = data.documentName;

                const binary = Buffer.from(data.state)

                await prisma.workspace.upsert({
                    where: {
                        id: id
                    },
                    update: {
                        content: binary
                    },
                    create: {
                        id: id,
                        name: 'Untitled',
                        content: binary,
                        userID: userId,
                        orgID: orgId
                    }
                })
            },
        })
    ]
})