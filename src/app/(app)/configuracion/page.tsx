import { ConnectPanel } from "@/components/connect-panel";
import { getSession } from "@/lib/session";
import { getRate, getBakeryName } from "@/lib/db";

export const instant = false;

export default async function ConfiguracionPage() {
  const session = await getSession();
  let bakery = session?.bakery ?? "Mi Panaderia";
  let rate = 6.92;

  if (session?.licenseId) {
    try {
      bakery = await getBakeryName(session.licenseId);
      rate = await getRate(session.licenseId);
    } catch {
      // DB not ready yet
    }
  }

  return (
    <div>
      <h1 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em]">
        Configuracion
      </h1>
      <p className="mt-2 mb-6 max-w-xl text-[14.5px] leading-relaxed font-semibold text-suave">
        Tu licencia {session?.lic ? `- ${session.lic.slice(0, 8)}...` : ""} esta activa.
      </p>
      <ConnectPanel bakery={bakery} rate={rate} />
    </div>
  );
}
