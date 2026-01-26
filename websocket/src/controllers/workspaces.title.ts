import { Request, response, Response } from "express";
import { prisma } from "../utils/prisma.js";

export async function patchTitle(req: Request, res: Response) {
    console.log('Client is changing title');

    const {id, title} = req.body as {
        id: string,
        title: string
    }

    try {
        await prisma.workspace.update({
            where: {
                id,
            },
            data: {
                name: title
            }
        })

        console.log('Successfully changed')

        return res.sendStatus(200);
    }
    catch {
        console.log('Failure')
        return res.sendStatus(500);
    }   
}