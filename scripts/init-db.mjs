#!/usr/bin/env node
import { Pool } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const env = readFileSync(".env", "utf8");
let dbUrl = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!dbUrl) {
  console.error("No se encontro DATABASE_URL en .env");
  process.exit(1);
}
dbUrl = dbUrl
  .replace(/^["']|["']$/g, "")
  .replace(/&channel_binding=[^&]*/g, "")
  .replace(/-pooler/g, "")
  .replace(/[?&]$/, "");

const pool = new Pool({ connectionString: dbUrl });

const tables = [
  `CREATE TABLE IF NOT EXISTS licenses (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    bakery_name TEXT NOT NULL DEFAULT 'Mi Panaderia',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS login_attempts (
    id SERIAL PRIMARY KEY,
    license_key TEXT NOT NULL,
    ip TEXT,
    success BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_login_attempts_key_time ON login_attempts(license_key, created_at)`,
  `CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    license_id INTEGER NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    fecha DATE, producto TEXT, cantidad NUMERIC, precio_unit NUMERIC, total NUMERIC
  )`,
  `CREATE INDEX IF NOT EXISTS idx_sales_license ON sales(license_id)`,
  `CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    license_id INTEGER NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    fecha DATE, proveedor TEXT, producto TEXT, cantidad NUMERIC, costo_unit NUMERIC, total NUMERIC
  )`,
  `CREATE INDEX IF NOT EXISTS idx_purchases_license ON purchases(license_id)`,
  `CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    license_id INTEGER NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    producto TEXT, stock_actual NUMERIC, stock_minimo NUMERIC, proveedor TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS idx_inventory_license ON inventory(license_id)`,
  `CREATE TABLE IF NOT EXISTS analysis (
    id SERIAL PRIMARY KEY,
    license_id INTEGER NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    fecha DATE, periodo TEXT, informe TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS idx_analysis_license ON analysis(license_id)`,
  `CREATE TABLE IF NOT EXISTS app_config (
    id SERIAL PRIMARY KEY,
    license_id INTEGER NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    clave TEXT NOT NULL, valor TEXT,
    UNIQUE(license_id, clave)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_config_license ON app_config(license_id)`,
];

console.log("Creando tablas en NeonDB...");
for (const q of tables) {
  await pool.query(q);
}
console.log("Listo. Todas las tablas creadas.");
await pool.end();
