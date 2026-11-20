import { Server } from "socket.io";
import { AuthPayload, ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../lib/definitions.js";
import jwt from'jsonwebtoken';
import { prisma } from "./prisma.js";
import { findAccessibleWorkspace } from "./access.js";

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>({
    connectTimeout: 30000,
    // Hocuspocus shares the HTTP server, so leave its upgrade requests alone
    destroyUpgrade: false,
    cors: {
        origin: process.env.NEXT_URL,
        credentials: true
    }
})

io.use(async (socket, next) => {
    console.log('Checking for message auth')
    const {docName, token} = socket.handshake.auth as {
        docName: string,
        token: string,
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

        const doc = await findAccessibleWorkspace(docName, decoded);

        if(!doc) throw new Error('GTFO');

        // Messages are attributed from the verified token, never from what the client sends
        socket.data.userId = decoded.userId;
        socket.data.docName = docName;

        socket.join(docName);

        console.log('Authorized for message')

        next();
    }
    catch(e: any) {
        console.log('Unauthorized for message')
        next(new Error('Unauthorized'));
    }
})

io.on("connection", (socket) => {
    console.log('Client has connected to socket')
    const {userId, docName} = socket.data;

    socket.on('message', async (msg) =>{
        if(typeof msg?.content !== 'string' || !msg.content.trim()) return;

        console.log('Saving msg to db')
        // An unhandled rejection here would crash the whole process
        try {
            const message = await prisma.message.create({
                data: {
                    content: msg.content,
                    senderId: userId,
                    workspaceId: docName
                },
                select: {
                    id: true,
                    content: true,
                    senderId: true,
                    createdAt: true
                }
            })

            const msgString = {
                ...message,
                createdAt: message.createdAt.toISOString()
            }

            console.log('Sending msg to client')

            io.to(docName).emit('message', msgString);
        }
        catch(e: any) {
            console.error('Failed to save message', e);
        }
    })
})

export {io}