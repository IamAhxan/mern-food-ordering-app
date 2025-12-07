import { auth } from "express-oauth2-jwt-bearer";
import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import User from './../models/user.js'

declare global {
    namespace Express {
        interface Request {
            userId: string;
            auth0Id: string;
        }
    }
}

const {
    AUTH0_AUDIENCE,
    AUTH0_ISSUER_BASE_URL
} = process.env;

if (!AUTH0_AUDIENCE || !AUTH0_ISSUER_BASE_URL) {
    throw new Error("Missing required Auth0 environment variables. Check AUTH0_AUDIENCE and AUTH0_ISSUER_BASE_URL.");
}


export const jwtCheck = auth({
    audience: AUTH0_AUDIENCE,
    issuerBaseURL: AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});

export const jwtParse = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
        return res.sendStatus(401)
    }

    const token = authorization.split(" ")[1] as string;

    try {
        const decoded = jwt.decode(token) as jwt.JwtPayload;
        const auth0Id = decoded.sub;

        if (!auth0Id) {
            return res.sendStatus(401)
        }
        const user = await User.findOne({ auth0Id });
        if (!user) {
            return res.sendStatus(401);
        }

        req.auth0Id = auth0Id as string;
        req.userId = user._id.toString()
        next()
    } catch (error) {
        return res.sendStatus(401)
    }
}