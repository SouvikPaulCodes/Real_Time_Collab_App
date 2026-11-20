import { Server } from "socket.io";
import { AuthPayload, ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../lib/definitions.js";
import jwt from'jsonwebtoken';
import { prisma } from "./prisma.js";

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

        const id = docName;
        
        const doc = await prisma.workspace.findUnique({
            where: {id}
        })

        if(doc && (doc?.userID!==decoded.userId && doc?.orgID!==decoded.orgId)) throw new Error('GTFO');

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
    const {docName} = socket.handshake.auth as {
        docName: string,
        token: string,
    };

    socket.on('message', async (msg) =>{
        console.log('Saving msg to db')
        const message = await prisma.message.create({
            data: {
                content: msg.content,
                senderId: msg.senderId,
                workspaceId: msg.workspaceId
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
    })
})

export {io}