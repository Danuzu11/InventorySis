import { sql, ensureSchema, findOrCreateLicense } from "./db";

const MAX_ATTEMPTS = 3;
const LOCK_MINUTES = 15;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function isLicenseInEnv(key: string): boolean {
  const raw = process.env.LICENSE_KEYS ?? "";
  const valid = raw.split(",").map((k) => k.trim()).filter(Boolean);
  const candidate = key.trim();
  if (!candidate) return false;
  return valid.some((k) => timingSafeEqual(k, candidate));
}

export type LicenseResult =
  | { ok: true; licenseId: number }
  | { ok: false; error: string; locked?: boolean };

export async function validateLicense(rawKey: string, ip: string): Promise<LicenseResult> {
  await ensureSchema();
  const key = rawKey.trim();

  if (!key || key.length < 4 || key.length > 64) {
    return { ok: false, error: "Licencia invalida." };
  }

  const failures = await sql`
    SELECT COUNT(*)::int as count FROM login_attempts
    WHERE license_key = ${key} AND success = false
    AND created_at > now() - make_interval(mins => ${LOCK_MINUTES})
  `;
  if (failures[0].count >= MAX_ATTEMPTS) {
    return {
      ok: false,
      error: `Demasiados intentos fallidos. Espera ${LOCK_MINUTES} minutos antes de intentar de nuevo.`,
      locked: true,
    };
  }

  const keyValid = isLicenseInEnv(key);

  if (!keyValid) {
    await sql`INSERT INTO login_attempts (license_key, ip, success) VALUES (${key}, ${ip}, false)`;
    return { ok: false, error: "Licencia no valida o dada de baja." };
  }

  const licenseId = await findOrCreateLicense(key);

  await sql`INSERT INTO login_attempts (license_key, ip, success) VALUES (${key}, ${ip}, true)`;
  await sql`DELETE FROM login_attempts WHERE license_key = ${key} AND created_at < now() - interval '1 hour'`;

  return { ok: true, licenseId };
}
