import type { Request, Response, NextFunction } from "express";
import { createHash } from "node:crypto";
import type { PrismaClient } from "../../generated/prisma/client.js";

export interface ApiClientRequest extends Request {
  apiClient?: { idDlkApiClient: number; nameApiClient: string };
}

export function sha256Hex(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

/**
 * Valida el header `X-API-Key` contra MD_API_CLIENT (por hash SHA-256).
 * Para endpoints máquina-a-máquina (ej. ingesta DPP). No usa JWT de usuario.
 */
export function apiKeyMiddleware(prisma: PrismaClient) {
  return async (req: ApiClientRequest, res: Response, next: NextFunction) => {
    const raw = req.headers["x-api-key"];
    const key = (Array.isArray(raw) ? raw[0] : raw)?.trim();
    if (!key) {
      return res.status(401).json({ error: "API key no proporcionada", type: "UNAUTHORIZED" });
    }
    try {
      const client = await prisma.mdApiClient.findFirst({
        where: { keyHash: sha256Hex(key), stateApiClient: 1, flgStatutActif: 1 },
        select: { idDlkApiClient: true, nameApiClient: true },
      });
      if (!client) {
        return res.status(401).json({ error: "API key inválida", type: "UNAUTHORIZED" });
      }
      req.apiClient = client;
      next();
    } catch (e) {
      console.error("[api-key]", e);
      return res.status(500).json({ error: "Error de autenticación", type: "INTERNAL" });
    }
  };
}
