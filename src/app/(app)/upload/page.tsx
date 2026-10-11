import { UploadWizard } from "@/components/upload-wizard";
import { getSession } from "@/lib/session";
import Link from "next/link";

export const instant = false;

export default async function UploadPage() {
  const session = await getSession();

  return (
    <div>
      <h1 className="text-[26px] leading-tight font-extrabold tracking-[-0.02em]">
        Subir Excel
      </h1>
      <p className="mt-2 mb-6 max-w-xl text-[14.5px] leading-relaxed font-semibold text-suave">
        Trae el archivo tal cual lo tienes — de tu caja, tu Excel de toda la vida o
        el export del sistema. Nosotros acomodamos las columnas.
      </p>

      {!session?.licenseId && !session?.demo && (
        <p className="mb-5 rounded-xl border border-ambar/50 bg-ambar/15 px-4 py-3 text-[13.5px] font-bold">
          Primero inicia sesion con tu licencia en{" "}
          <Link href="/" className="underline decoration-wavy underline-offset-2">
            la pagina principal
          </Link>
          .
        </p>
      )}

      <UploadWizard />
    </div>
  );
}
