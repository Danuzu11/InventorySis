import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export function StockAlert({
  items,
}: {
  items: { producto: string; actual: number; minimo: number }[];
}) {
  if (items.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-pistacho/70 bg-pistacho/25 px-4 py-3.5">
        <p className="text-[13px] font-bold text-[#33463A] dark:text-[#DFF0E2]">
          Todo el inventario está por encima del mínimo. Buen momento para producir.
        </p>
      </div>
    );
  }

  const first = items[0];
  const extra = items.length - 1;

  return (
    <div className="mt-4 flex items-center gap-3 rounded-xl border border-ambar/50 bg-ambar/15 px-4 py-3.5">
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ambar text-[#3B2417] dark:text-[#2B1A10]"
      >
        <TriangleAlert size={15} strokeWidth={2.4} />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-bold">
          Stock bajo: {first.producto} — quedan {first.actual}{" "}
          {extra > 0 && <span className="font-semibold text-suave">(+{extra} más)</span>}
        </p>
        <p className="text-[12px] font-semibold text-suave">
          Mínimo {first.minimo} · reponer antes de que se acabe
        </p>
      </div>
      <Link
        href="/inventario"
        className="ml-auto hidden shrink-0 rounded-lg bg-ambar px-3.5 py-2 text-[12px] font-extrabold text-[#3B2417] transition-colors hover:bg-ambar-fuerte sm:block dark:text-[#2B1A10]"
      >
        Ver inventario
      </Link>
    </div>
  );
}
