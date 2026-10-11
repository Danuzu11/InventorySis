import * as XLSX from "xlsx";

export type ParsedSheet = {
  name: string;
  headers: string[];
  rows: unknown[][];
};

export type ParsedWorkbook = {
  sheets: ParsedSheet[];
};

export async function parseWorkbook(file: File): Promise<ParsedWorkbook> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const sheets: ParsedSheet[] = wb.SheetNames.map((name) => {
    const ws = wb.Sheets[name];
    const aoa = XLSX.utils.sheet_to_json<unknown[]>(ws, {
      header: 1,
      blankrows: false,
      defval: "",
    });
    if (aoa.length === 0) return { name, headers: [], rows: [] };
    const headers = (aoa[0] as unknown[]).map((h) => String(h ?? "").trim());
    const rows = aoa.slice(1).filter((r) => r.some((c) => String(c ?? "").trim() !== ""));
    return { name, headers, rows };
  });
  return { sheets: sheets.filter((s) => s.headers.length > 0) };
}

export const FIELD_OPTIONS = {
  ventas: ["fecha", "producto", "cantidad", "precio_unit", "total"],
  compras: ["fecha", "proveedor", "producto", "cantidad", "costo_unit", "total"],
  inventario: ["producto", "stock_actual", "stock_minimo", "proveedor"],
} as const;

export type TargetType = keyof typeof FIELD_OPTIONS;
