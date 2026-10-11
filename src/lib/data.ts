import { sql, ensureSchema, getRate } from "./db";
import { computeKpis, demoKpis, type KpiData } from "./kpis";
import { getSession } from "./session";

export type SaleRow = {
  fecha: string | Date | null;
  producto: string;
  cantidad: number;
  precio_unit: number;
  total: number;
};

export type PurchaseRow = {
  fecha: string | Date | null;
  proveedor: string;
  producto: string;
  cantidad: number;
  costo_unit: number;
  total: number;
};

export type InventoryRow = {
  producto: string;
  stock_actual: number;
  stock_minimo: number;
  proveedor: string;
};

export async function loadKpis(): Promise<
  { ok: true; data: KpiData } | { ok: false; needsSetup: boolean }
> {
  const session = await getSession();
  if (!session) return { ok: false, needsSetup: false };

  if (session.demo || !session.licenseId) {
    if (session.demo) return { ok: true, data: demoKpis() };
    return { ok: false, needsSetup: true };
  }

  await ensureSchema();
  const licenseId = session.licenseId;

  const [sales, purchases, inventory, rate] = await Promise.all([
    sql`SELECT fecha, producto, cantidad::numeric as cantidad, precio_unit::numeric as precio_unit, total::numeric as total FROM sales WHERE license_id = ${licenseId}`,
    sql`SELECT fecha, proveedor, producto, cantidad::numeric as cantidad, costo_unit::numeric as costo_unit, total::numeric as total FROM purchases WHERE license_id = ${licenseId}`,
    sql`SELECT producto, stock_actual::numeric as stock_actual, stock_minimo::numeric as stock_minimo, proveedor FROM inventory WHERE license_id = ${licenseId}`,
    getRate(licenseId),
  ]);

  return {
    ok: true,
    data: computeKpis({
      sales: sales as unknown as SaleRow[],
      purchases: purchases as unknown as PurchaseRow[],
      inventory: inventory as unknown as InventoryRow[],
      rate,
    }),
  };
}

export async function insertSales(licenseId: number, rows: unknown[][]) {
  await ensureSchema();
  for (const row of rows) {
    const fecha = row[0] ? String(row[0]).slice(0, 10) : null;
    const producto = String(row[1] ?? "");
    const cantidad = Number(row[2]) || 0;
    const precioUnit = Number(row[3]) || 0;
    const total = row[4] !== "" && row[4] != null ? Number(row[4]) : cantidad * precioUnit;
    await sql`INSERT INTO sales (license_id, fecha, producto, cantidad, precio_unit, total)
      VALUES (${licenseId}, ${fecha}, ${producto}, ${cantidad}, ${precioUnit}, ${total})`;
  }
}

export async function insertPurchases(licenseId: number, rows: unknown[][]) {
  await ensureSchema();
  for (const row of rows) {
    const fecha = row[0] ? String(row[0]).slice(0, 10) : null;
    const proveedor = String(row[1] ?? "");
    const producto = String(row[2] ?? "");
    const cantidad = Number(row[3]) || 0;
    const costoUnit = Number(row[4]) || 0;
    const total = row[5] !== "" && row[5] != null ? Number(row[5]) : cantidad * costoUnit;
    await sql`INSERT INTO purchases (license_id, fecha, proveedor, producto, cantidad, costo_unit, total)
      VALUES (${licenseId}, ${fecha}, ${proveedor}, ${producto}, ${cantidad}, ${costoUnit}, ${total})`;
  }
}

export async function insertInventory(licenseId: number, rows: unknown[][]) {
  await ensureSchema();
  for (const row of rows) {
    const producto = String(row[0] ?? "");
    const stockActual = Number(row[1]) || 0;
    const stockMinimo = Number(row[2]) || 0;
    const proveedor = String(row[3] ?? "");
    await sql`INSERT INTO inventory (license_id, producto, stock_actual, stock_minimo, proveedor)
      VALUES (${licenseId}, ${producto}, ${stockActual}, ${stockMinimo}, ${proveedor})`;
  }
}

export async function insertAnalysis(licenseId: number, periodo: string, informe: string) {
  await ensureSchema();
  const hoy = new Date().toISOString().slice(0, 10);
  await sql`INSERT INTO analysis (license_id, fecha, periodo, informe)
    VALUES (${licenseId}, ${hoy}, ${periodo}, ${informe})`;
}

export async function getAnalysisHistory(licenseId: number, limit = 5) {
  await ensureSchema();
  const rows = await sql`SELECT fecha, periodo, informe FROM analysis
    WHERE license_id = ${licenseId} ORDER BY id DESC LIMIT ${limit}`;
  return rows;
}
