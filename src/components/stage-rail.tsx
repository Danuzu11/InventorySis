import { Check, Clock, Wheat } from "lucide-react";

export function StageRail({ orders }: { orders: number }) {
  const now = new Date();
  const hour = now.getHours();
  const closing = hour >= 19;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-suave uppercase">
        Jornada de hoy
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        <StagePill state="done" label="Amasado" icon={<Check size={12} strokeWidth={3} />} />
        <span aria-hidden className="text-borde">›</span>
        <StagePill state="done" label="Horneado" icon={<Check size={12} strokeWidth={3} />} />
        <span aria-hidden className="text-borde">›</span>
        <StagePill
          state={closing ? "done" : "now"}
          label={closing ? "Cerrado" : `Vendido · ${orders} pedidos`}
          icon={closing ? <Check size={12} strokeWidth={3} /> : <Wheat size={12} strokeWidth={2.6} />}
        />
        <span aria-hidden className="text-borde">›</span>
        <StagePill
          state={closing ? "now" : "next"}
          label={closing ? "Reposo hasta mañana" : "Cierre 19:00"}
          icon={<Clock size={12} strokeWidth={2.6} />}
        />
      </div>
    </div>
  );
}

function StagePill({
  state,
  label,
  icon,
}: {
  state: "done" | "now" | "next";
  label: string;
  icon: React.ReactNode;
}) {
  const cls =
    state === "done"
      ? "bg-pistacho text-[#33463A] dark:text-[#DFF0E2]"
      : state === "now"
        ? "bg-ambar text-[#3B2417] dark:text-[#2B1A10]"
        : "bg-melaza text-[#5C4A3D] dark:bg-melaza/40 dark:text-suave";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
}
