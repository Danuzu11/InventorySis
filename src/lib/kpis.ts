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

export type KpiData = {
  ingresos: number;
  costos: number;
  ganancia: number;
  margen: number;
  ingresosPrev: number;
  deltaPct: number;
  ventasCount: number;
  pedidosHoy: number;
  rate: number;
  periodoLabel: string;
  serieDiaria: { fecha: string; ingresos: number }[];
  topProductos: { producto: string; unidades: number; ingresos: number }[];
  stockBajo: { producto: string; actual: number; minimo: number }[];
  inventario: {
    producto: string;
    actual: number;
    minimo: number;
    proveedor: string;
  }[];
  demo: boolean;
};

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const MES = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
];

export function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return `${MES[Number(m) - 1]} ${y}`;
}

function toDate(v: string | Date | null): Date | null {
  if (!v) return null;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v;
  const s = String(v);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function computeKpis(input: {
  sales: SaleRow[];
  purchases: PurchaseRow[];
  inventory: InventoryRow[];
  rate: number;
  demo?: boolean;
}): KpiData {
  const { sales, purchases, inventory, rate } = input;
  const now = new Date();
  const currentKey = monthKey(now);
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevKey = monthKey(prevDate);
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  let ingresos = 0;
  let ingresosPrev = 0;
  let ventasCount = 0;
  let pedidosHoy = 0;
  const porProducto = new Map<string, { u: number; r: number }>();
  const porDia = new Map<string, number>();

  for (const row of sales) {
    const fecha = toDate(row.fecha);
    const producto = row.producto || "Sin nombre";
    const cantidad = Number(row.cantidad) || 0;
    const precio = Number(row.precio_unit) || 0;
    const total = Number(row.total) || cantidad * precio;
    if (!fecha) continue;
    const key = monthKey(fecha);
    if (key === currentKey) {
      ventasCount++;
      ingresos += total;
      const dk = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
      if (dk === todayKey) pedidosHoy++;
      const p = porProducto.get(producto) ?? { u: 0, r: 0 };
      p.u += cantidad || 1;
      p.r += total;
      porProducto.set(producto, p);
      porDia.set(dk, (porDia.get(dk) ?? 0) + total);
    } else if (key === prevKey && fecha.getDate() <= now.getDate()) {
      ingresosPrev += total;
    }
  }

  let costos = 0;
  for (const row of purchases) {
    const fecha = toDate(row.fecha);
    if (!fecha || monthKey(fecha) !== currentKey) continue;
    costos += Number(row.total) || 0;
  }

  const ganancia = ingresos - costos;
  const margen = ingresos > 0 ? (ganancia / ingresos) * 100 : 0;
  const deltaPct = ingresosPrev > 0 ? ((ingresos - ingresosPrev) / ingresosPrev) * 100 : 0;

  const topProductos = [...porProducto.entries()]
    .map(([producto, v]) => ({ producto, unidades: Math.round(v.u), ingresos: v.r }))
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, 5);

  const dias = [...porDia.entries()].sort(([a], [b]) => a.localeCompare(b));
  const serieDiaria = dias.slice(-30).map(([fecha, ing]) => ({ fecha, ingresos: ing }));

  const inv = inventory
    .map((r) => ({
      producto: r.producto,
      actual: Number(r.stock_actual) || 0,
      minimo: Number(r.stock_minimo) || 0,
      proveedor: r.proveedor || "",
    }))
    .filter((r) => r.producto);

  const stockBajo = inv.filter((r) => r.actual < r.minimo);

  return {
    ingresos,
    costos,
    ganancia,
    margen,
    ingresosPrev,
    deltaPct,
    ventasCount,
    pedidosHoy,
    rate,
    periodoLabel: monthLabel(currentKey),
    serieDiaria,
    topProductos,
    stockBajo,
    inventario: inv,
    demo: input.demo ?? false,
  };
}

export function demoKpis(): KpiData {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const today = Math.min(now.getDate(), new Date(y, m + 1, 0).getDate());

  const products = [
    { name: "Pan francés", price: 1.5, base: 650 },
    { name: "Alfajor de maicena", price: 4, base: 140 },
    { name: "Croissant de mantequilla", price: 4.5, base: 100 },
    { name: "Torta de chocolate 1/2", price: 20, base: 18 },
    { name: "Medialuna de grasa", price: 1.5, base: 210 },
  ];

  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed % 1000) / 1000;
  };

  const sales: SaleRow[] = [];
  const purchases: PurchaseRow[] = [];
  const inventory: InventoryRow[] = [
    { producto: "Harina 0000", stock_actual: 12, stock_minimo: 25, proveedor: "Molinos Santa Cruz" },
    { producto: "Azúcar flor", stock_actual: 40, stock_minimo: 20, proveedor: "Dulces del Sur" },
    { producto: "Mantequilla", stock_actual: 18, stock_minimo: 15, proveedor: "Lácteos La Vega" },
    { producto: "Huevos (docena)", stock_actual: 22, stock_minimo: 10, proveedor: "Granja El Valle" },
    { producto: "Chocolate cobertura", stock_actual: 9, stock_minimo: 12, proveedor: "Cacao Bolivia" },
  ];

  const fechaStr = (d: number, mm: number, yy: number) =>
    `${yy}-${String(mm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const semana = [
    { prov: "Molinos Santa Cruz", prod: "Harina 0000", qty: 250, cost: 2.2 },
    { prov: "Dulces del Sur", prod: "Azúcar flor", qty: 80, cost: 6.5 },
    { prov: "Lácteos La Vega", prod: "Mantequilla", qty: 45, cost: 38 },
    { prov: "Granja El Valle", prod: "Huevos (docena)", qty: 40, cost: 42 },
  ];

  for (let d = 1; d <= today; d++) {
    for (const p of products) {
      if (rand() < 0.1) continue;
      const qty = Math.max(1, Math.round(p.base * (0.65 + rand() * 0.7)));
      sales.push({
        fecha: fechaStr(d, m, y),
        producto: p.name,
        cantidad: qty,
        precio_unit: p.price,
        total: qty * p.price,
      });
    }
    if (d % 7 === 3) {
      for (const c of semana) {
        purchases.push({
          fecha: fechaStr(d, m, y),
          proveedor: c.prov,
          producto: c.prod,
          cantidad: c.qty,
          costo_unit: c.cost,
          total: c.qty * c.cost,
        });
      }
    }
  }

  const prevM = m === 0 ? 11 : m - 1;
  const prevY = m === 0 ? y - 1 : y;
  for (let d = 1; d <= 28; d++) {
    for (const p of products) {
      if (rand() < 0.12) continue;
      const qty = Math.max(1, Math.round(p.base * 0.88));
      sales.push({
        fecha: fechaStr(d, prevM, prevY),
        producto: p.name,
        cantidad: qty,
        precio_unit: p.price,
        total: qty * p.price,
      });
    }
  }

  return computeKpis({ sales, purchases, inventory, rate: 6.92, demo: true });
}
