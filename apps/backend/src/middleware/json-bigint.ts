import type { NextFunction, Request, Response } from "express";

/**
 * `JSON.stringify` / `res.json` fallan con BigInt. El driver MariaDB/Prisma
 * puede devolver bigint en algunos enteros → 500 silencioso en listas (ej. empresas).
 */
export function jsonBigIntMiddleware(_req: Request, res: Response, next: NextFunction) {
  const origJson = res.json.bind(res);
  res.json = function jsonSafe(body: unknown) {
    if (body === null || body === undefined) {
      return origJson(body);
    }
    if (typeof body !== "object") {
      return origJson(body);
    }
    try {
      const normalized = JSON.parse(
        JSON.stringify(body, (_k, v) => (typeof v === "bigint" ? Number(v) : v))
      );
      return origJson(normalized);
    } catch {
      return origJson(body);
    }
  };
  next();
}
