"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { fecha: string; ingresos: number };

function shortDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${Number(d)}/${Number(m)}`;
}

function LiveDot(props: {
  cx?: number | string;
  cy?: number | string;
  payload?: Point;
  lastFecha?: string;
}) {
  const { cx, cy, payload, lastFecha } = props;
  if (!payload || payload.fecha !== lastFecha) return null;
  const x = Number(cx);
  const y = Number(cy);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill="var(--ambar)" opacity={0.25} className="pulse-dot" />
      <circle cx={x} cy={y} r={4.5} fill="var(--ambar)" stroke="var(--tarjeta)" strokeWidth={2} />
    </g>
  );
}

export function DoughCurve({ data }: { data: Point[] }) {
  const tick = { fill: "var(--suave)", fontSize: 11, fontWeight: 600 };

  return (
    <div
      className="dough-grow mt-3 h-[240px]"
      role="img"
      aria-label={`Curva de ingresos diarios de los últimos ${data.length} días. Último día: Bs ${Math.round(data[data.length - 1]?.ingresos ?? 0)}.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="masaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--serie-a)" stopOpacity={0.95} />
              <stop offset="100%" stopColor="var(--serie-a)" stopOpacity={0.16} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--borde)" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="fecha"
            tickFormatter={shortDate}
            tick={tick}
            axisLine={{ stroke: "var(--borde)" }}
            tickLine={false}
            minTickGap={36}
          />
          <YAxis
            tick={tick}
            axisLine={false}
            tickLine={false}
            width={54}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
            }
          />
          <Tooltip
            cursor={{ stroke: "var(--ambar)", strokeWidth: 1.5 }}
            contentStyle={{
              background: "var(--tarjeta)",
              border: "1px solid var(--borde)",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--tinta)",
              fontFamily: "var(--font-nunito), sans-serif",
            }}
            labelFormatter={(l) => `Día ${shortDate(String(l))}`}
            formatter={(value) => [
              `Bs ${Number(value).toLocaleString("es-BO")}`,
              "Ingresos",
            ]}
          />
          <Area
            type="monotone"
            dataKey="ingresos"
            stroke="var(--ambar)"
            strokeWidth={2.5}
            fill="url(#masaFill)"
            dot={false}
            activeDot={{ r: 5, fill: "var(--ambar)", stroke: "var(--tarjeta)", strokeWidth: 2 }}
            isAnimationActive
            animationDuration={900}
          />
          <Area
            type="monotone"
            dataKey="ingresos"
            stroke="none"
            fill="none"
            dot={<LiveDot lastFecha={data[data.length - 1]?.fecha} />}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
