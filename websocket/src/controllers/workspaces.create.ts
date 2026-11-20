import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { prisma } from "../utils/prisma.js";

export async function createWorkspace(req: Request, res: Response) {
    console.log('Client is creating a workspace');

    try {
        const userId = req.user?.userId;

        if(!userId) return res.sendStatus(401);

        // Content stays empty until Hocuspocus stores the first edit
        const workspace = await prisma.workspace.create({
            data: {
                id: randomUUID(),
                name: 'Untitled',
                content: new Uint8Array(),
                userID: userId,
                orgID: req.user?.orgId ?? null
            },
            select: {
                id: true
            }
        })

        return res.status(201).json(workspace);
    }
    catch {
        return res.status(500).json({error: 'Failed to create workspace'})
    }
}
