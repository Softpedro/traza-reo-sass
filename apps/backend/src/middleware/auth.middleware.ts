import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthService, JwtPayload } from "../services/auth.service.js";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

type AuthMiddlewareOptions = {
  /** Paths que se dejan pasar sin token. `req.path` se compara tras quitar el prefijo del Router montado. */
  publicPaths?: RegExp[];
};

/** Verifica el header `Authorization: Bearer <token>` y popula req.user. */
export function authMiddleware(service: AuthService, options: AuthMiddlewareOptions = {}) {
  const publicPaths = options.publicPaths ?? [];
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const fullPath = req.originalUrl.split("?")[0] ?? req.path;
    if (publicPaths.some((re) => re.test(fullPath))) return next();

    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado", type: "UNAUTHORIZED" });
    }
    const token = header.slice("Bearer ".length).trim();
    if (!token) {
      return res.status(401).json({ error: "Token vacío", type: "UNAUTHORIZED" });
    }
    try {
      req.user = service.verifyToken(token);
      next();
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: "Token expirado", type: "TOKEN_EXPIRED" });
      }
      return res.status(401).json({ error: "Token inválido", type: "INVALID_TOKEN" });
    }
  };
}
