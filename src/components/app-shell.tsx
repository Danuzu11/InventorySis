"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BrainCircuit,
  Boxes,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  TrendingUp,
  X,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/ventas", label: "Ventas", icon: TrendingUp },
  { href: "/compras", label: "Compras", icon: ShoppingCart },
  { href: "/inventario", label: "Inventario", icon: Boxes },
  { href: "/analisis", label: "Analisis", icon: BrainCircuit },
  { href: "/configuracion", label: "Config", icon: Settings },
];

export function AppShell({
  bakery,
  demo,
  children,
}: {
  bakery?: string;
  demo?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-borde bg-tarjeta/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/dashboard" className="shrink-0 text-[19px] font-extrabold tracking-tight">
            Inventario<span className="text-ambar-fuerte">SIS</span>
          </Link>
          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                    active
                      ? "bg-rosa text-tinta"
                      : "text-suave hover:bg-melaza/50 hover:text-tinta"
                  }`}
                >
                  <Icon size={15} strokeWidth={2.2} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2.5">
            {demo && (
              <span className="hidden rounded-full border border-dashed border-ambar px-3 py-1 font-mono text-[10px] font-semibold tracking-wider text-[#8F4F2B] uppercase dark:text-ambar sm:block">
                Demo
              </span>
            )}
            {!demo && bakery && (
              <span className="hidden max-w-[160px] truncate text-sm font-semibold text-suave md:block">
                {bakery}
              </span>
            )}
            <ThemeToggle />
            <button
              type="button"
              onClick={logout}
              aria-label="Cerrar sesión"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-borde text-suave transition-colors hover:border-alerta hover:text-alerta"
            >
              <LogOut size={15} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-borde text-suave transition-colors hover:border-ambar hover:text-ambar-fuerte lg:hidden"
            >
              {open ? <X size={16} strokeWidth={2.4} /> : <Menu size={16} strokeWidth={2.4} />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-borde bg-tarjeta px-4 pt-2 pb-3 lg:hidden">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[14.5px] font-bold transition-colors ${
                    active ? "bg-rosa text-tinta" : "text-suave hover:bg-melaza/50"
                  }`}
                >
                  <Icon size={16} strokeWidth={2.2} />
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
