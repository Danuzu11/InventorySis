const nf = new Intl.NumberFormat("es-BO", {
  maximumFractionDigits: 0,
});

const nf2 = new Intl.NumberFormat("es-BO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export function bs(n: number): string {
  return nf.format(Math.round(n));
}

export function usd(n: number, rate: number): string {
  return nf.format(Math.round(n / rate));
}

export function pct(n: number): string {
  return `${nf2.format(n)}%`;
}

export function deltaPct(n: number): string {
  const sign = n > 0 ? "▲" : n < 0 ? "▼" : "•";
  return `${sign} ${nf2.format(Math.abs(n))}%`;
}

export function parseNumber(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v !== "string") return 0;
  const clean = v
    .replace(/[^\d,.\-]/g, "")
    .replace(/\.(?=\d{3}\b)/g, "")
    .replace(",", ".");
  const n = Number.parseFloat(clean);
  return Number.isFinite(n) ? n : 0;
}

export function parseDate(v: unknown): Date | null {
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  if (typeof v === "number" && v > 20000 && v < 60000) {
    const ms = Math.round((v - 25569) * 86400000);
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof v !== "string" || !v.trim()) return null;
  const s = v.trim();
  let m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    const [, a, b, y] = m;
    const year = y.length === 2 ? 2000 + Number(y) : Number(y);
    const d = new Date(year, Number(b) - 1, Number(a));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}
