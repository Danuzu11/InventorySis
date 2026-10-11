import { neon } from "@neondatabase/serverless";

const rawUrl = process.env.DATABASE_URL ?? "";
const cleanUrl = rawUrl
  .replace(/^["']|["']$/g, "")
  .replace(/&channel_binding=[^&]*/g, "")
  .replace(/-pooler/g, "")
  .replace(/[?&]$/, "");

export const sql = neon(cleanUrl);

let schemaReady = false;

export async function ensureSchema() {
  if (schemaReady) return;
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no esta configurado. Pegá tu connection string de Neon en .env");
  }

  await sql`CREATE TABLE IF NOT EXISTS licenses (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    bakery_name TEXT NOT NULL DEFAULT 'Mi Panaderia',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS login_attempts (
    id SERIAL PRIMARY KEY,
    license_key TEXT NOT NULL,
    ip TEXT,
    success BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

  await sql`CREATE INDEX IF NOT EXISTS idx_login_attempts_key_time
    ON login_attempts(license_key, created_at)`;

  await sql`CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    license_id INTEGER NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    fecha DATE,
    producto TEXT,
    cantidad NUMERIC,
    precio_unit NUMERIC,
    total NUMERIC
  )`;

  await sql`CREATE INDEX IF NOT EXISTS idx_sales_license ON sales(license_id)`;

  await sql`CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    license_id INTEGER NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    fecha DATE,
    proveedor TEXT,
    producto TEXT,
    cantidad NUMERIC,
    costo_unit NUMERIC,
    total NUMERIC
  )`;

  await sql`CREATE INDEX IF NOT EXISTS idx_purchases_license ON purchases(license_id)`;

  await sql`CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    license_id INTEGER NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    producto TEXT,
    stock_actual NUMERIC,
    stock_minimo NUMERIC,
    proveedor TEXT
  )`;

  await sql`CREATE INDEX IF NOT EXISTS idx_inventory_license ON inventory(license_id)`;

  await sql`CREATE TABLE IF NOT EXISTS analysis (
    id SERIAL PRIMARY KEY,
    license_id INTEGER NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    fecha DATE,
    periodo TEXT,
    informe TEXT
  )`;

  await sql`CREATE INDEX IF NOT EXISTS idx_analysis_license ON analysis(license_id)`;

  await sql`CREATE TABLE IF NOT EXISTS app_config (
    id SERIAL PRIMARY KEY,
    license_id INTEGER NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    clave TEXT NOT NULL,
    valor TEXT,
    UNIQUE(license_id, clave)
  )`;

  await sql`CREATE INDEX IF NOT EXISTS idx_config_license ON app_config(license_id)`;

  schemaReady = true;
}

export async function findOrCreateLicense(key: string): Promise<number> {
  await ensureSchema();
  const existing = await sql`SELECT id FROM licenses WHERE key = ${key} AND active = true`;
  if (existing.length > 0) return existing[0].id;

  const created = await sql`INSERT INTO licenses (key) VALUES (${key}) RETURNING id`;
  return created[0].id;
}

export async function getLicenseIdByKey(key: string): Promise<number | null> {
  await ensureSchema();
  const rows = await sql`SELECT id FROM licenses WHERE key = ${key} AND active = true`;
  return rows.length > 0 ? rows[0].id : null;
}

export async function getRate(licenseId: number): Promise<number> {
  await ensureSchema();
  const rows = await sql`SELECT valor FROM app_config WHERE license_id = ${licenseId} AND clave = 'tasa_usd_bs'`;
  if (rows.length > 0) {
    const n = Number(rows[0].valor);
    if (Number.isFinite(n) && n > 0) return n;
  }
  await sql`INSERT INTO app_config (license_id, clave, valor) VALUES (${licenseId}, 'tasa_usd_bs', '6.92') ON CONFLICT (license_id, clave) DO NOTHING`;
  return 6.92;
}

export async function setConfig(licenseId: number, clave: string, valor: string) {
  await ensureSchema();
  await sql`INSERT INTO app_config (license_id, clave, valor) VALUES (${licenseId}, ${clave}, ${valor})
    ON CONFLICT (license_id, clave) DO UPDATE SET valor = ${valor}`;
}

export async function getBakeryName(licenseId: number): Promise<string> {
  await ensureSchema();
  const rows = await sql`SELECT bakery_name FROM licenses WHERE id = ${licenseId}`;
  return rows.length > 0 ? rows[0].bakery_name : "Mi Panaderia";
}

export async function setBakeryName(licenseId: number, name: string) {
  await ensureSchema();
  await sql`UPDATE licenses SET bakery_name = ${name} WHERE id = ${licenseId}`;
}
