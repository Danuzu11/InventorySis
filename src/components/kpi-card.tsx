export function KpiCard({
  label,
  value,
  unit,
  sub,
  accent,
  delay,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: React.ReactNode;
  accent: "rosa" | "melaza" | "pistacho" | "ambar";
  delay: number;
}) {
  const bar =
    accent === "rosa"
      ? "bg-rosa"
      : accent === "melaza"
        ? "bg-melaza"
        : accent === "pistacho"
          ? "bg-pistacho"
          : "bg-ambar";

  return (
    <div
      className="rise-in relative overflow-hidden rounded-2xl border border-borde bg-tarjeta px-5 py-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span aria-hidden className={`absolute top-0 bottom-0 left-0 w-1 ${bar}`} />
      <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-suave uppercase">
        {label}
      </p>
      <p className="tnum mt-1.5 text-[32px] leading-none font-extrabold tracking-[-0.02em]">
        {value}
        {unit && <span className="ml-1 text-[15px] font-bold text-suave">{unit}</span>}
      </p>
      {sub && <p className="mt-2 text-[12.5px] font-semibold text-suave">{sub}</p>}
    </div>
  );
}
