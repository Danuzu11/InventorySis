import { AnalyzePanel } from "@/components/analyze-panel";

export const instant = false;

export default async function AnalisisPage() {
  return (
    <div>
      <h1 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em]">
        Análisis IA
      </h1>
      <p className="mt-2 mb-6 max-w-xl text-[14.5px] leading-relaxed font-semibold text-suave">
        La IA lee tus ventas, compras y stock, y te dice en criollo: qué se vendió
        bien, qué perdió plata y qué reponer esta semana. El informe se guarda en tu
        planilla para que tengas historial.
      </p>
      <AnalyzePanel />
    </div>
  );
}
