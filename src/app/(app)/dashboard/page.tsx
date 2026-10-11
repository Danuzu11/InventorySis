import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DoughCurve } from "@/components/dough-curve";
import { KpiCard } from "@/components/kpi-card";
import { StageRail } from "@/components/stage-rail";
import { StockAlert } from "@/components/stock-alert";
import { TopProducts } from "@/components/top-products";
import { loadKpis } from "@/lib/data";
import { bs, deltaPct, pct, usd } from "@/lib/format";

export const instant = false;

export default async function DashboardPage() {
  const result = await loadKpis();

  if (!result.ok) {
    return (
      <div className="rise-in mx-auto max-w-xl rounded-2xl border border-borde bg-tarjeta p-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Carga tus primeros datos
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed font-semibold text-suave">
          Sube un Excel de ventas o compras para ver tus metricas al instante.
          Tambien puedes explorar con datos de demostracion.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-ambar px-5 py-3 text-[15px] font-extrabold text-[#3B2417] transition-colors hover:bg-ambar-fuerte"
          >
            Subir Excel
            <ArrowUpRight size={16} strokeWidth={2.6} />
          </Link>
          <Link
            href="/configuracion"
            className="inline-flex items-center gap-2 rounded-xl border border-borde px-5 py-3 text-[15px] font-bold text-suave transition-colors hover:border-ambar hover:text-tinta"
          >
            Configuracion
          </Link>
        </div>
      </div>
    );
  }

  const k = result.data;
  const hora = new Date().toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <div className="mb-5">
        <StageRail orders={k.pedidosHoy} />
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="rise-in text-[26px] leading-tight font-extrabold tracking-[-0.02em]">
          Tu negocio, en etapas
        </h1>
        <p className="rise-in text-[13px] font-semibold text-suave" style={{ animationDelay: "60ms" }}>
          {k.periodoLabel} · actualizado {hora} · tasa 1 USD = {k.rate.toLocaleString("es-BO")} Bs
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label={`Ingresos · ${k.periodoLabel}`}
          value={`Bs ${bs(k.ingresos)}`}
          sub={
            <>
              ≈ USD {usd(k.ingresos, k.rate)} ·{" "}
              <span className={k.deltaPct >= 0 ? "text-verde" : "text-alerta"}>
                {deltaPct(k.deltaPct)} vs mes anterior
              </span>
            </>
          }
          accent="rosa"
          delay={0}
        />
        <KpiCard
          label="Costos"
          value={`Bs ${bs(k.costos)}`}
          sub={k.ingresos > 0 ? `Sobre ingresos: ${pct((k.costos / k.ingresos) * 100)}` : "Sin ingresos registrados"}
          accent="melaza"
          delay={80}
        />
        <KpiCard
          label="Ganancia neta"
          value={`Bs ${bs(k.ganancia)}`}
          sub={`≈ USD ${usd(k.ganancia, k.rate)} libres`}
          accent="pistacho"
          delay={160}
        />
        <KpiCard
          label="Margen"
          value={pct(k.margen)}
          sub={
            k.margen >= 30
              ? "Saludable para una panadería"
              : k.margen >= 15
                ? "Ajustado: revisa tus costos"
                : "Preocúpate por los costos"
          }
          accent="ambar"
          delay={240}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_1fr]">
        <section className="rise-in rounded-2xl border border-borde bg-tarjeta p-5" style={{ animationDelay: "300ms" }}>
          <h2 className="text-[15px] font-extrabold tracking-[-0.01em]">
            Curva de fermentación — ingresos de 30 días
          </h2>
          <p className="mt-1 text-[12.5px] font-semibold text-suave">
            La masa sube: cada día es una fermentación que termina en la caja.
          </p>
          {k.serieDiaria.length > 0 ? (
            <DoughCurve data={k.serieDiaria} />
          ) : (
            <p className="mt-6 mb-2 text-sm font-semibold text-suave">
              Todavía no hay ingresos con fecha en este mes. Carga tu Excel de ventas para ver la curva.
            </p>
          )}
        </section>

        <section className="rise-in rounded-2xl border border-borde bg-tarjeta p-5" style={{ animationDelay: "380ms" }}>
          <h2 className="text-[15px] font-extrabold tracking-[-0.01em]">Lo que más sale</h2>
          <p className="mt-1 text-[12.5px] font-semibold text-suave">
            Productos del mes, listos para hornear más.
          </p>
          <TopProducts products={k.topProductos} />
          <StockAlert items={k.stockBajo} />
        </section>
      </div>
    </div>
  );
}
