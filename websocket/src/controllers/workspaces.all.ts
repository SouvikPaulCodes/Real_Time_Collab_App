import { Request, Response } from 'express';
import {prisma} from '../utils/prisma.js';

export default async function getWorkspaces(req: Request, res: Response) {
    console.log('Client is trying to fetch')
    try {
        let orgId: string | undefined;
        let userId: string | undefined;

        if(req.user?.orgId) orgId = req.user?.orgId;
        userId = req.user?.userId;
        
        const data = orgId ? await prisma.workspace.findMany({
            where: {
                orgID: orgId
            },
            select: {
                id: true,
                name: true,
                userID: true,
                createdAt: true,
                updatedAt: true
            }
        }) : userId ?
        await prisma.workspace.findMany({
            where: {
                AND: {
                    userID: userId,
                    orgID: null,
                }
            },
            select: {
                id: true,
                name: true,
                userID: true,
                createdAt: true,
                updatedAt: true
            }
        }) :
        null;

        return res.status(200).json(data);
    }
    catch(e) {
        return res.status(500).json({error: 'Failed to fetch projects'})
    }
}