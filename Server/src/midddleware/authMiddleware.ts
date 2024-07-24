const asyncHandler = require('express-async-handler')
// import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// interface JwtPayload {
//     id: number;
// }

export const authenticateToken=(asyncHandler(((req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer <token>"

    if (token == null) return res.status(401).json({ error: 'Token not found' });

    jwt.verify(token, 'umeralikhan', (err:any, user:any) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user; // Attach user info to the request
        console.log(user)
        next();
    });
})))

