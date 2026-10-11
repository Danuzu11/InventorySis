import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/ventas", "/compras", "/upload", "/analisis", "/inventario", "/configuracion"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("inventario_session")?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/ventas/:path*", "/compras/:path*", "/upload/:path*", "/analisis/:path*", "/inventario/:path*", "/configuracion/:path*"],
};
