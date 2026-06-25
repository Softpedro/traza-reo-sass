import { Router, type Request } from "express";
import { DeviceType } from "../../generated/prisma/client.js";
import { AuthError, type AuthService } from "../services/auth.service.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.middleware.js";

function getClientIp(req: Request): string {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    return xff.split(",")[0]!.trim();
  }
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

/** Extracción muy básica de navegador / SO / device desde el User-Agent. Suficiente para auditar accesos. */
function parseUserAgent(ua: string | undefined) {
  if (!ua) {
    return {
      browser: null as string | null,
      browserVersion: null as string | null,
      operatingSystem: null as string | null,
      deviceType: DeviceType.OTHER,
    };
  }

  // BOT primero: si es scraper/curl/wget/etc, descartamos navegador/SO normales
  if (/bot|crawler|spider|scraper|curl|wget|python-requests|postman|httpie|axios/i.test(ua)) {
    return {
      browser: null,
      browserVersion: null,
      operatingSystem: null,
      deviceType: DeviceType.BOT,
    };
  }

  let browser: string | null = null;
  let browserVersion: string | null = null;
  const browsers: { re: RegExp; name: string }[] = [
    { re: /Edg\/(\d+\.\d+)/, name: "Edge" },
    { re: /OPR\/(\d+\.\d+)/, name: "Opera" },
    { re: /Chrome\/(\d+\.\d+)/, name: "Chrome" },
    { re: /Firefox\/(\d+\.\d+)/, name: "Firefox" },
    { re: /Safari\/(\d+\.\d+)/, name: "Safari" },
  ];
  for (const b of browsers) {
    const m = ua.match(b.re);
    if (m) {
      browser = b.name;
      browserVersion = m[1] ?? null;
      break;
    }
  }

  let operatingSystem: string | null = null;
  if (/Windows NT/.test(ua)) operatingSystem = "Windows";
  else if (/Mac OS X/.test(ua)) operatingSystem = "macOS";
  else if (/Android/.test(ua)) operatingSystem = "Android";
  else if (/iPhone|iPad|iOS/.test(ua)) operatingSystem = "iOS";
  else if (/Linux/.test(ua)) operatingSystem = "Linux";

  // iPad ANTES de Mobile (iPad iOS reporta "Mobile" también)
  let deviceType: DeviceType = DeviceType.PC;
  if (/iPad|Tablet/i.test(ua)) deviceType = DeviceType.TABLET;
  else if (/Mobile|Android|iPhone/i.test(ua)) deviceType = DeviceType.MOBILE;

  return { browser, browserVersion, operatingSystem, deviceType };
}

export function authRoutes(service: AuthService): Router {
  const router = Router();

  router.post("/login", async (req, res) => {
    try {
      const userLogin = String(req.body?.userLogin ?? "").trim();
      const password = String(req.body?.password ?? "");
      if (!userLogin || !password) {
        return res
          .status(400)
          .json({ error: "Usuario y contraseña son obligatorios", type: "VALIDATION" });
      }

      const userAgent = req.headers["user-agent"];
      const ua = parseUserAgent(typeof userAgent === "string" ? userAgent : undefined);

      const result = await service.login(userLogin, password, {
        ipAddress: getClientIp(req),
        browser: ua.browser,
        browserVersion: ua.browserVersion,
        operatingSystem: ua.operatingSystem,
        deviceType: ua.deviceType,
        userAgentRaw: typeof userAgent === "string" ? userAgent : null,
      });
      res.json(result);
    } catch (e) {
      if (e instanceof AuthError) {
        const status = e.code === "USER_LOCKED" ? 423 : e.code === "USER_INACTIVE" ? 403 : 401;
        return res.status(status).json({ error: e.message, type: e.code });
      }
      console.error("[auth:login]", e);
      const message = e instanceof Error ? e.message : "Error desconocido";
      res.status(500).json({ error: message, type: "INTERNAL" });
    }
  });

  router.get("/me", authMiddleware(service), async (req: AuthRequest, res) => {
    try {
      const me = await service.me(req.user!.sub);
      if (!me) return res.status(404).json({ error: "Usuario no encontrado", type: "NOT_FOUND" });
      const remaining = await service.countActiveBackupCodes(req.user!.sub);
      res.json({ ...me, backupCodesRemaining: remaining });
    } catch (e) {
      console.error("[auth:me]", e);
      const message = e instanceof Error ? e.message : "Error desconocido";
      res.status(500).json({ error: message, type: "INTERNAL" });
    }
  });

  // Foto del usuario logueado (binaria). Endpoint dedicado para no arrastrar el blob en /me.
  router.get("/me/photo", authMiddleware(service), async (req: AuthRequest, res) => {
    try {
      const photo = await service.mePhoto(req.user!.sub);
      if (!photo) return res.status(404).json({ error: "Sin foto", type: "NOT_FOUND" });
      res.setHeader("Content-Type", photo.contentType);
      res.setHeader("Cache-Control", "private, max-age=300");
      res.send(photo.buffer);
    } catch (e) {
      console.error("[auth:me/photo]", e);
      const message = e instanceof Error ? e.message : "Error desconocido";
      res.status(500).json({ error: message, type: "INTERNAL" });
    }
  });

  // ── 2FA: paso 2 del login (público; el tempToken viene en el body) ──
  router.post("/2fa/verify", async (req, res) => {
    try {
      const tempToken = String(req.body?.tempToken ?? "");
      const code = String(req.body?.code ?? "");
      if (!tempToken || !code) {
        return res.status(400).json({ error: "tempToken y code son obligatorios", type: "VALIDATION" });
      }
      const userAgent = req.headers["user-agent"];
      const ua = parseUserAgent(typeof userAgent === "string" ? userAgent : undefined);
      const result = await service.verifyTwoFactor(tempToken, code, {
        ipAddress: getClientIp(req),
        browser: ua.browser,
        browserVersion: ua.browserVersion,
        operatingSystem: ua.operatingSystem,
        deviceType: ua.deviceType,
        userAgentRaw: typeof userAgent === "string" ? userAgent : null,
      });
      res.json(result);
    } catch (e) {
      if (e instanceof AuthError) {
        const status =
          e.code === "USER_LOCKED" ? 423 : e.code === "TEMP_TOKEN_INVALID" ? 401 : 401;
        return res.status(status).json({ error: e.message, type: e.code });
      }
      console.error("[auth:2fa:verify]", e);
      const message = e instanceof Error ? e.message : "Error desconocido";
      res.status(500).json({ error: message, type: "INTERNAL" });
    }
  });

  // ── 2FA: setup / confirm / disable / regenerate (todos requieren JWT real) ──
  router.post("/2fa/setup", authMiddleware(service), async (req: AuthRequest, res) => {
    try {
      const result = await service.start2FASetup(req.user!.sub);
      res.json(result);
    } catch (e) {
      if (e instanceof AuthError) {
        return res.status(409).json({ error: e.message, type: e.code });
      }
      console.error("[auth:2fa:setup]", e);
      const message = e instanceof Error ? e.message : "Error desconocido";
      res.status(500).json({ error: message, type: "INTERNAL" });
    }
  });

  router.post("/2fa/verify-setup", authMiddleware(service), async (req: AuthRequest, res) => {
    try {
      const code = String(req.body?.code ?? "");
      if (!code) return res.status(400).json({ error: "Falta code", type: "VALIDATION" });
      const result = await service.confirm2FASetup(req.user!.sub, code);
      res.json(result);
    } catch (e) {
      if (e instanceof AuthError) {
        const status = e.code === "TOTP_INVALID" ? 401 : 409;
        return res.status(status).json({ error: e.message, type: e.code });
      }
      console.error("[auth:2fa:verify-setup]", e);
      const message = e instanceof Error ? e.message : "Error desconocido";
      res.status(500).json({ error: message, type: "INTERNAL" });
    }
  });

  router.post("/2fa/disable", authMiddleware(service), async (req: AuthRequest, res) => {
    try {
      const password = String(req.body?.password ?? "");
      const code = String(req.body?.code ?? "");
      if (!password || !code) {
        return res.status(400).json({ error: "password y code son obligatorios", type: "VALIDATION" });
      }
      await service.disable2FA(req.user!.sub, password, code);
      res.json({ message: "2FA desactivado" });
    } catch (e) {
      if (e instanceof AuthError) {
        const status = e.code === "INVALID_CREDENTIALS" || e.code === "TOTP_INVALID" ? 401 : 409;
        return res.status(status).json({ error: e.message, type: e.code });
      }
      console.error("[auth:2fa:disable]", e);
      const message = e instanceof Error ? e.message : "Error desconocido";
      res.status(500).json({ error: message, type: "INTERNAL" });
    }
  });

  router.post("/2fa/regenerate-codes", authMiddleware(service), async (req: AuthRequest, res) => {
    try {
      const code = String(req.body?.code ?? "");
      if (!code) return res.status(400).json({ error: "Falta code", type: "VALIDATION" });
      const result = await service.regenerateBackupCodes(req.user!.sub, code);
      res.json(result);
    } catch (e) {
      if (e instanceof AuthError) {
        const status = e.code === "TOTP_INVALID" ? 401 : 409;
        return res.status(status).json({ error: e.message, type: e.code });
      }
      console.error("[auth:2fa:regenerate]", e);
      const message = e instanceof Error ? e.message : "Error desconocido";
      res.status(500).json({ error: message, type: "INTERNAL" });
    }
  });

  return router;
}
