import { Request, Response } from 'express';
import {prisma} from '../utils/prisma.js';

export default async function getMessages(req: Request, res: Response) {
    console.log('Client is trying to fetch')
    try {
        let orgId: string | undefined;
        let userId: string | undefined;
        let id: string | undefined;

        if(req.user?.orgId) orgId = req.user?.orgId;
        userId = req.user?.userId;
        id = req.user?.id;

        if(!id) throw new Error('No Workspace ID');
        
        const data = await prisma.message.findMany({
            where: {
                workspaceId: id
            }
        })

        return res.status(200).json(data);
    }
    catch(e: any) {
        return res.status(500).json({e: 'Failed to fetch messages'})
    }
}