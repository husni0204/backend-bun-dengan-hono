import type {MiddlewareHandler} from "hono";
import {verify} from "hono/jwt";

export const verifyToken: MiddlewareHandler = async (c, next) => {
    // Get header Authorization
    const header = c.req.header('Authorization') || c.req.header('authorization') || ""

    // format "Bearer xxx" or token raw (if send without prefix)
    const token = header.startsWith("Bearer") ? header.slice(7).trim() : header.trim()

    // if token found
    if (!token) {
        return c.json({message: "Unauthenticated."}, 401)
    }

    try {
        // get secret from .env
        const secret = process.env.JWT_SECRET || "default"

        // verify token with secret
        const payload = await verify(token, secret)

        // get userId from payload
        const userId = (payload as any).id ?? (payload as any).sub

        // save userId to context to use next route
        c.set("userId", userId)

        // continue to next handler
        await next()
    } catch {
        // if invalid token
        return c.json({message: "Invalid Token"}, 401)
    }
}