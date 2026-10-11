import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LoginForm } from "@/components/login-form";

export const instant = false;

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px] rise-in">
        <div className="mb-8 text-center">
          <h1 className="text-[34px] leading-tight font-extrabold tracking-tight">
            Inventario
            <span className="text-ambar-fuerte underline decoration-wavy decoration-from-font underline-offset-[6px]">
              SIS
            </span>
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed font-semibold text-suave">
            Sube tus Excels de ventas y compras.
            <br />
            Entendé tu panadería en minutos.
          </p>
        </div>
        <div className="rounded-2xl border border-borde bg-tarjeta p-7">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-[13px] font-semibold text-suave">
          ¿Perdiste tu clave? Escríbenos y te la reenviamos.
        </p>
      </div>
    </div>
  );
}
