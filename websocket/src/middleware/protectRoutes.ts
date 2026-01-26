import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { AuthPayload } from '../lib/definitions.js';

export function protection(req: Request, res: Response, next: NextFunction) {
    try {
        const auth = req.headers.authorization;

        console.log('Protection started')

        if(!auth) return res.status(401).json({message: 'Unauthenticated - No Token Provided'});

        const token = auth.split(" ")[1];

        if(!token) return res.status(401).json({message: 'Unauthenticated - No Token Provided'});

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

        if(!decoded) return res.status(401).json({message: 'Unauthorized - Invalid Token'});

        req.user = {
            userId: decoded.userId,
            ...(decoded.orgId && {orgId: decoded.orgId}),
            ...(decoded.id && {id: decoded.id})
        }

        console.log('Protection finished')

        next();
    }
    catch(error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ message: 'Unauthorized - Invalid or Expired Token' });
    }
}