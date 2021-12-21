import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const secret = process.env.JWT_KEY as string

export async function generate(payload: any): Promise<string> {
    const token = await jwt.sign(payload, secret, { expiresIn: '3d', issuer: 'lorenzobotti.github.io' })
    return token
}

export async function validate(token: string): Promise<string | JwtPayload> {
    const payload = await jwt.verify(token, secret, { issuer: 'lorenzobotti.github.io', maxAge: '3d' })
    return payload
}

export async function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        res.status(401)
        res.end()
        return
    }

    const token = stripPrefix(authHeader, 'Bearer ')

    console.log({ token })

    try {
        const payload = await validate(token);

        (req as any)['user'] = payload
        // console.log({ reqParamsInMiddleware: Object.keys(req) })
    } catch(e) {
        console.error('error validating token')
        console.error(e)
        
        res.status(401)
        res.end()
        return
    }

    next()
}

function stripPrefix(haystack: string, needle: string): string {
    if (haystack.startsWith(needle)) {
        return haystack.slice(needle.length)
    } else {
        return haystack
    }
}


