import { bs } from "@/lib/format";

export function TopProducts({
  products,
}: {
  products: { producto: string; unidades: number; ingresos: number }[];
}) {
  if (products.length === 0) {
    return (
      <p className="mt-4 text-sm font-semibold text-suave">
        Sin ventas registradas este mes todavía.
      </p>
    );
  }

  return (
    <table className="mt-3 w-full">
      <thead>
        <tr className="border-b border-borde">
          <th className="py-2.5 pr-3 text-left font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
            Producto
          </th>
          <th className="py-2.5 px-3 text-right font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
            Unid.
          </th>
          <th className="py-2.5 pl-3 text-right font-mono text-[10px] font-semibold tracking-[0.1em] text-suave uppercase">
            Ingresos
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.producto} className="border-b border-borde/60 last:border-0">
            <td className="py-3 pr-3 text-[13.5px] font-semibold">{p.producto}</td>
            <td className="tnum py-3 px-3 text-right text-[13.5px] font-semibold text-suave">
              {p.unidades.toLocaleString("es-BO")}
            </td>
            <td className="tnum py-3 pl-3 text-right text-[13.5px] font-bold">
              Bs {bs(p.ingresos)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
