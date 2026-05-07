import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { generateSecret, generateURI, verifySync } from "otplib";
import qrcode from "qrcode";
import { AccessStatus, DeviceType, type PrismaClient } from "../../generated/prisma/client.js";
import { decryptSecret, encryptSecret } from "../lib/crypto.js";

export type JwtPayload = {
  sub: number;
  userLogin: string;
  rolUser: number;
  idDlkParentCompany: number;
};

type TempTokenPayload = {
  sub: number;
  userLogin: string;
  scope: "2fa-pending";
};

export type AuthenticatedUser = {
  idDlkUserReo: number;
  codUserReo: string;
  userLogin: string;
  nameUser: string;
  paternalLastNameUser: string;
  maternalLastNameUser: string;
  emailUser: string;
  rolUser: number;
  positionUser: number;
  idDlkParentCompany: number;
  codParentCompany: string;
};

export type LoginResult =
  | {
      requires2FA: false;
      token: string;
      expiresIn: string;
      user: AuthenticatedUser;
    }
  | {
      requires2FA: true;
      tempToken: string;
      userLogin: string;
    };

export type AccessLogContext = {
  ipAddress: string;
  browser?: string | null;
  browserVersion?: string | null;
  operatingSystem?: string | null;
  deviceType?: DeviceType;
  userAgentRaw?: string | null;
};

export type TwoFASetupResult = {
  secret: string; // base32, mostrarlo al usuario por si no puede escanear
  qrDataUrl: string; // imagen PNG en data:URL
  otpauthUrl: string; // URL otpauth:// (también va en el QR)
};

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 30;
const GEO_TIMEOUT_MS = 2000;
const TEMP_TOKEN_TTL = "5m";
const BACKUP_CODE_COUNT = 8;
const BACKUP_BCRYPT_ROUNDS = 10;
const TOTP_ISSUER = process.env.TOTP_ISSUER ?? "TRAZA";

export class AuthError extends Error {
  constructor(
    public code:
      | "INVALID_CREDENTIALS"
      | "USER_LOCKED"
      | "USER_INACTIVE"
      | "TOTP_INVALID"
      | "TWO_FA_NOT_SETUP"
      | "TWO_FA_ALREADY_ENABLED"
      | "TEMP_TOKEN_INVALID",
    message: string
  ) {
    super(message);
  }
}

type GeoData = {
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
};

function isPrivateIp(ip: string): boolean {
  if (!ip || ip === "unknown") return true;
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("::ffff:127.")) return true;
  if (/^10\./.test(ip)) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[01])\./.test(ip)) return true;
  if (/^192\.168\./.test(ip)) return true;
  if (/^169\.254\./.test(ip)) return true;
  if (/^f[cd]/i.test(ip)) return true;
  return false;
}

async function lookupGeo(ip: string): Promise<GeoData | null> {
  if (isPrivateIp(ip)) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), GEO_TIMEOUT_MS);
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,city,lat,lon`,
      { signal: ctrl.signal }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      status?: string;
      country?: string;
      city?: string;
      lat?: number;
      lon?: number;
    };
    if (data.status !== "success") return null;
    return {
      country: data.country?.slice(0, 100) ?? null,
      city: data.city?.slice(0, 100) ?? null,
      latitude: typeof data.lat === "number" ? data.lat : null,
      longitude: typeof data.lon === "number" ? data.lon : null,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** "ABCD-EFGH-IJKL-MNOP" — 16 chars hex agrupados, fáciles de tipear. */
function generateBackupCode(): string {
  const buf = randomBytes(8).toString("hex").toUpperCase(); // 16 chars
  return `${buf.slice(0, 4)}-${buf.slice(4, 8)}-${buf.slice(8, 12)}-${buf.slice(12, 16)}`;
}

function normalizeBackupCode(input: string): string {
  return input.replace(/[\s-]/g, "").toUpperCase();
}

export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor(private prisma: PrismaClient) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET no configurado en variables de entorno");
    this.jwtSecret = secret;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "8h";
  }

  // ─────────────────────────────────────────────────────────────────
  // Login (paso 1)
  // ─────────────────────────────────────────────────────────────────

  async login(userLogin: string, password: string, ctx: AccessLogContext): Promise<LoginResult> {
    const user = await this.prisma.mdUserReo.findUnique({
      where: { userLogin },
      include: {
        parentCompany: { select: { idDlkParentCompany: true, codParentCompany: true } },
      },
    });

    if (!user || user.flgStatutActif !== 1) {
      throw new AuthError("INVALID_CREDENTIALS", "Usuario o contraseña incorrectos");
    }

    if (user.stateUser !== 1) {
      await this.logAccess(user.idDlkUserReo, ctx, AccessStatus.BLOCKED);
      throw new AuthError("USER_INACTIVE", "Usuario inactivo");
    }

    if (user.isLocked === 1) {
      const stillLocked = !user.lockedUntil || user.lockedUntil > new Date();
      if (stillLocked) {
        await this.logAccess(user.idDlkUserReo, ctx, AccessStatus.BLOCKED);
        throw new AuthError("USER_LOCKED", "Cuenta bloqueada por intentos fallidos. Intenta más tarde.");
      }
      await this.prisma.mdUserReo.update({
        where: { idDlkUserReo: user.idDlkUserReo },
        data: { isLocked: 0, failedAttempts: 0, lockedUntil: null },
      });
      user.isLocked = 0;
      user.failedAttempts = 0;
    }

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      const newAttempts = (user.failedAttempts ?? 0) + 1;
      const shouldLock = newAttempts >= MAX_FAILED_ATTEMPTS;
      await this.prisma.mdUserReo.update({
        where: { idDlkUserReo: user.idDlkUserReo },
        data: {
          failedAttempts: newAttempts,
          isLocked: shouldLock ? 1 : 0,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000) : null,
        },
      });
      await this.logAccess(
        user.idDlkUserReo,
        ctx,
        shouldLock ? AccessStatus.BLOCKED : AccessStatus.FAILED
      );
      throw new AuthError(
        shouldLock ? "USER_LOCKED" : "INVALID_CREDENTIALS",
        shouldLock
          ? `Demasiados intentos fallidos. Cuenta bloqueada por ${LOCKOUT_MINUTES} minutos.`
          : "Usuario o contraseña incorrectos"
      );
    }

    // Password OK. Si tiene 2FA habilitado: emitir tempToken y NO el JWT real.
    if (user.twoFactorEnabled === 1 && user.twoFactorSecret) {
      await this.logAccess(user.idDlkUserReo, ctx, AccessStatus.PENDING);
      const tempPayload: TempTokenPayload = {
        sub: user.idDlkUserReo,
        userLogin: user.userLogin,
        scope: "2fa-pending",
      };
      const tempToken = jwt.sign(tempPayload, this.jwtSecret, {
        expiresIn: TEMP_TOKEN_TTL,
      } satisfies SignOptions);
      return { requires2FA: true, tempToken, userLogin: user.userLogin };
    }

    // Sin 2FA: emitir JWT final ya
    return await this.completeLogin(user.idDlkUserReo, ctx);
  }

  // ─────────────────────────────────────────────────────────────────
  // Login paso 2: verificar TOTP o backup code, emitir JWT
  // ─────────────────────────────────────────────────────────────────

  async verifyTwoFactor(
    tempToken: string,
    code: string,
    ctx: AccessLogContext
  ): Promise<LoginResult> {
    let payload: TempTokenPayload;
    try {
      payload = jwt.verify(tempToken, this.jwtSecret) as unknown as TempTokenPayload;
    } catch {
      throw new AuthError("TEMP_TOKEN_INVALID", "Sesión 2FA expirada. Vuelve a iniciar sesión.");
    }
    if (payload.scope !== "2fa-pending") {
      throw new AuthError("TEMP_TOKEN_INVALID", "Token inválido");
    }

    const user = await this.prisma.mdUserReo.findUnique({ where: { idDlkUserReo: payload.sub } });
    if (!user || user.flgStatutActif !== 1 || user.twoFactorEnabled !== 1 || !user.twoFactorSecret) {
      throw new AuthError("TWO_FA_NOT_SETUP", "El usuario no tiene 2FA habilitado");
    }

    if (user.isLocked === 1 && (!user.lockedUntil || user.lockedUntil > new Date())) {
      await this.logAccess(user.idDlkUserReo, ctx, AccessStatus.BLOCKED);
      throw new AuthError("USER_LOCKED", "Cuenta bloqueada. Intenta más tarde.");
    }

    const trimmed = code.trim();
    let valid = false;

    // Si parece un código TOTP de 6 dígitos: probar TOTP
    if (/^\d{6}$/.test(trimmed)) {
      try {
        const secret = decryptSecret(user.twoFactorSecret);
        valid = verifySync({ secret, token: trimmed }).valid;
      } catch {
        valid = false;
      }
    } else {
      // Asumimos backup code
      valid = await this.consumeBackupCode(user.idDlkUserReo, trimmed);
    }

    if (!valid) {
      const newAttempts = (user.failedAttempts ?? 0) + 1;
      const shouldLock = newAttempts >= MAX_FAILED_ATTEMPTS;
      await this.prisma.mdUserReo.update({
        where: { idDlkUserReo: user.idDlkUserReo },
        data: {
          failedAttempts: newAttempts,
          isLocked: shouldLock ? 1 : 0,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000) : null,
        },
      });
      await this.logAccess(
        user.idDlkUserReo,
        ctx,
        shouldLock ? AccessStatus.BLOCKED : AccessStatus.FAILED
      );
      throw new AuthError(
        shouldLock ? "USER_LOCKED" : "TOTP_INVALID",
        shouldLock
          ? `Demasiados intentos fallidos. Cuenta bloqueada por ${LOCKOUT_MINUTES} minutos.`
          : "Código inválido"
      );
    }

    return await this.completeLogin(user.idDlkUserReo, ctx);
  }

  /** Intenta marcar un backup code como usado. true si lo encontró y consumió. */
  private async consumeBackupCode(idDlkUserReo: number, plainCode: string): Promise<boolean> {
    const normalized = normalizeBackupCode(plainCode);
    if (!/^[0-9A-F]{16}$/.test(normalized)) return false;
    const codes = await this.prisma.mdUserBackupCode.findMany({
      where: { idDlkUserReo, usedAt: null },
    });
    for (const row of codes) {
      const ok = await bcrypt.compare(normalized, row.codeHash);
      if (ok) {
        await this.prisma.mdUserBackupCode.update({
          where: { idBackupCode: row.idBackupCode },
          data: { usedAt: new Date() },
        });
        return true;
      }
    }
    return false;
  }

  /** Emite el JWT final, resetea contador, registra SUCCESS. */
  private async completeLogin(idDlkUserReo: number, ctx: AccessLogContext): Promise<LoginResult> {
    const user = await this.prisma.mdUserReo.findUnique({
      where: { idDlkUserReo },
      include: {
        parentCompany: { select: { idDlkParentCompany: true, codParentCompany: true } },
      },
    });
    if (!user) throw new AuthError("INVALID_CREDENTIALS", "Usuario no encontrado");

    await this.prisma.mdUserReo.update({
      where: { idDlkUserReo },
      data: {
        failedAttempts: 0,
        isLocked: 0,
        lockedUntil: null,
        lastLoginDate: new Date(),
        lastLoginIp: ctx.ipAddress.slice(0, 45),
      },
    });
    await this.logAccess(idDlkUserReo, ctx, AccessStatus.SUCCESS);

    const payload: JwtPayload = {
      sub: user.idDlkUserReo,
      userLogin: user.userLogin,
      rolUser: user.rolUser,
      idDlkParentCompany: user.idDlkParentCompany,
    };
    const signOptions: SignOptions = { expiresIn: this.jwtExpiresIn as SignOptions["expiresIn"] };
    const token = jwt.sign(payload, this.jwtSecret, signOptions);

    return {
      requires2FA: false,
      token,
      expiresIn: this.jwtExpiresIn,
      user: {
        idDlkUserReo: user.idDlkUserReo,
        codUserReo: user.codUserReo,
        userLogin: user.userLogin,
        nameUser: user.nameUser,
        paternalLastNameUser: user.paternalLastNameUser,
        maternalLastNameUser: user.maternalLastNameUser,
        emailUser: user.emailUser,
        rolUser: user.rolUser,
        positionUser: user.positionUser,
        idDlkParentCompany: user.idDlkParentCompany,
        codParentCompany: user.codParentCompany,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // Setup / disable / regenerate (requieren sesión real)
  // ─────────────────────────────────────────────────────────────────

  async start2FASetup(idDlkUserReo: number): Promise<TwoFASetupResult> {
    const user = await this.prisma.mdUserReo.findUnique({ where: { idDlkUserReo } });
    if (!user) throw new AuthError("INVALID_CREDENTIALS", "Usuario no encontrado");
    if (user.twoFactorEnabled === 1) {
      throw new AuthError("TWO_FA_ALREADY_ENABLED", "El 2FA ya está habilitado. Desactívalo antes de reconfigurar.");
    }

    const secret = generateSecret(); // base32, default 20 bytes
    const otpauthUrl = generateURI({
      strategy: "totp",
      issuer: TOTP_ISSUER,
      label: user.userLogin,
      secret,
    });
    const qrDataUrl = await qrcode.toDataURL(otpauthUrl, { errorCorrectionLevel: "M", margin: 2 });

    await this.prisma.mdUserReo.update({
      where: { idDlkUserReo },
      data: { twoFactorSecret: encryptSecret(secret), twoFactorEnabled: 0 },
    });

    return { secret, qrDataUrl, otpauthUrl };
  }

  /** Confirma el primer código TOTP, marca enabled, genera y devuelve los backup codes (UNA SOLA VEZ). */
  async confirm2FASetup(idDlkUserReo: number, code: string): Promise<{ backupCodes: string[] }> {
    const user = await this.prisma.mdUserReo.findUnique({ where: { idDlkUserReo } });
    if (!user || !user.twoFactorSecret) {
      throw new AuthError("TWO_FA_NOT_SETUP", "Inicia el setup de 2FA primero.");
    }
    if (user.twoFactorEnabled === 1) {
      throw new AuthError("TWO_FA_ALREADY_ENABLED", "Ya está habilitado.");
    }
    const secret = decryptSecret(user.twoFactorSecret);
    if (!verifySync({ secret: secret, token: code.trim() }).valid) {
      throw new AuthError("TOTP_INVALID", "Código inválido");
    }

    const codes = Array.from({ length: BACKUP_CODE_COUNT }, generateBackupCode);
    const codesNormalized = codes.map(normalizeBackupCode);
    const hashes = await Promise.all(
      codesNormalized.map((c) => bcrypt.hash(c, BACKUP_BCRYPT_ROUNDS))
    );

    await this.prisma.$transaction([
      this.prisma.mdUserBackupCode.deleteMany({ where: { idDlkUserReo } }),
      this.prisma.mdUserBackupCode.createMany({
        data: hashes.map((codeHash) => ({ idDlkUserReo, codeHash })),
      }),
      this.prisma.mdUserReo.update({
        where: { idDlkUserReo },
        data: { twoFactorEnabled: 1 },
      }),
    ]);

    return { backupCodes: codes };
  }

  async disable2FA(idDlkUserReo: number, password: string, code: string): Promise<void> {
    const user = await this.prisma.mdUserReo.findUnique({ where: { idDlkUserReo } });
    if (!user) throw new AuthError("INVALID_CREDENTIALS", "Usuario no encontrado");
    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) throw new AuthError("INVALID_CREDENTIALS", "Contraseña incorrecta");
    if (user.twoFactorEnabled !== 1 || !user.twoFactorSecret) {
      throw new AuthError("TWO_FA_NOT_SETUP", "El 2FA no está activo");
    }
    const secret = decryptSecret(user.twoFactorSecret);
    if (!verifySync({ secret: secret, token: code.trim() }).valid) {
      throw new AuthError("TOTP_INVALID", "Código inválido");
    }
    await this.prisma.$transaction([
      this.prisma.mdUserBackupCode.deleteMany({ where: { idDlkUserReo } }),
      this.prisma.mdUserReo.update({
        where: { idDlkUserReo },
        data: { twoFactorEnabled: 0, twoFactorSecret: null },
      }),
    ]);
  }

  async regenerateBackupCodes(idDlkUserReo: number, code: string): Promise<{ backupCodes: string[] }> {
    const user = await this.prisma.mdUserReo.findUnique({ where: { idDlkUserReo } });
    if (!user || user.twoFactorEnabled !== 1 || !user.twoFactorSecret) {
      throw new AuthError("TWO_FA_NOT_SETUP", "El 2FA no está activo");
    }
    const secret = decryptSecret(user.twoFactorSecret);
    if (!verifySync({ secret: secret, token: code.trim() }).valid) {
      throw new AuthError("TOTP_INVALID", "Código inválido");
    }
    const codes = Array.from({ length: BACKUP_CODE_COUNT }, generateBackupCode);
    const hashes = await Promise.all(
      codes.map(normalizeBackupCode).map((c) => bcrypt.hash(c, BACKUP_BCRYPT_ROUNDS))
    );
    await this.prisma.$transaction([
      this.prisma.mdUserBackupCode.deleteMany({ where: { idDlkUserReo } }),
      this.prisma.mdUserBackupCode.createMany({
        data: hashes.map((codeHash) => ({ idDlkUserReo, codeHash })),
      }),
    ]);
    return { backupCodes: codes };
  }

  /** Cuántos backup codes activos quedan (sin usar). */
  async countActiveBackupCodes(idDlkUserReo: number): Promise<number> {
    return this.prisma.mdUserBackupCode.count({ where: { idDlkUserReo, usedAt: null } });
  }

  // ─────────────────────────────────────────────────────────────────
  // Comunes
  // ─────────────────────────────────────────────────────────────────

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.jwtSecret) as unknown as JwtPayload;
  }

  async me(idDlkUserReo: number) {
    const user = await this.prisma.mdUserReo.findUnique({
      where: { idDlkUserReo },
      include: {
        parentCompany: {
          select: { idDlkParentCompany: true, codParentCompany: true, nameParentCompany: true },
        },
      },
    });
    if (!user || user.flgStatutActif !== 1) return null;
    const { password: _omit, photograph, twoFactorSecret: _omit2, ...rest } = user;
    void _omit;
    void _omit2;
    return {
      ...rest,
      hasPhotograph: photograph != null && photograph.byteLength > 0,
    };
  }

  private async logAccess(
    idDlkUserReo: number,
    ctx: AccessLogContext,
    status: AccessStatus
  ) {
    try {
      const geo = await lookupGeo(ctx.ipAddress);
      await this.prisma.lgUserAccess.create({
        data: {
          idDlkUserReo,
          ipAddress: ctx.ipAddress.slice(0, 45),
          browser: ctx.browser?.slice(0, 50) ?? null,
          browserVersion: ctx.browserVersion?.slice(0, 50) ?? null,
          operatingSystem: ctx.operatingSystem?.slice(0, 50) ?? null,
          deviceType: ctx.deviceType ?? DeviceType.PC,
          latitude: geo?.latitude ?? null,
          longitude: geo?.longitude ?? null,
          city: geo?.city ?? null,
          country: geo?.country ?? null,
          accessStatus: status,
          userAgentRaw: ctx.userAgentRaw ?? null,
        },
      });
    } catch (e) {
      console.error("[auth:logAccess]", e);
    }
  }
}
