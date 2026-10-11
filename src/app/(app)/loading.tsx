export default function AppLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Cargando">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-4 w-24 rounded bg-melaza/50" />
        <div className="h-7 w-36 rounded-full bg-rosa/60" />
        <div className="h-7 w-32 rounded-full bg-pistacho/50" />
        <div className="h-7 w-28 rounded-full bg-melaza/40" />
      </div>
      <div className="mb-6 h-8 w-64 rounded-lg bg-melaza/40" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[118px] rounded-2xl border border-borde bg-tarjeta p-5"
          >
            <div className="h-3 w-28 rounded bg-melaza/40" />
            <div className="mt-3 h-8 w-36 rounded bg-melaza/30" />
            <div className="mt-3 h-3 w-24 rounded bg-melaza/20" />
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_1fr]">
        <div className="h-[340px] rounded-2xl border border-borde bg-tarjeta p-5">
          <div className="h-4 w-72 rounded bg-melaza/40" />
          <div className="mt-2 h-3 w-96 max-w-full rounded bg-melaza/20" />
          <div className="mt-6 h-[240px] rounded-xl bg-rosa/15" />
        </div>
        <div className="h-[340px] rounded-2xl border border-borde bg-tarjeta p-5">
          <div className="h-4 w-36 rounded bg-melaza/40" />
          <div className="mt-4 space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-3.5 flex-1 rounded bg-melaza/25" />
                <div className="h-3.5 w-14 rounded bg-melaza/20" />
                <div className="h-3.5 w-16 rounded bg-melaza/25" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
