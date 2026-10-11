import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "inventario_session";

export type SessionData = {
  lic: string;
  licenseId?: number;
  demo?: boolean;
  bakery?: string;
};

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET no esta configurado");
  return new TextEncoder().encode(s);
}

export async function createSession(data: SessionData) {
  const token = await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function getSession(): Promise<SessionData | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

export async function updateSession(patch: Partial<SessionData>) {
  const current = await getSession();
  if (!current) return null;
  const next = { ...current, ...patch };
  await createSession(next);
  return next;
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
