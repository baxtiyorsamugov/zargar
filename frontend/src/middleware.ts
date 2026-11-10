import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

// Адреса без префикса языка перенаправляются на /<язык>/...
// Язык берём из Accept-Language, иначе — язык по умолчанию.
function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // пропускаем служебные пути, файлы и медиа
  matcher: ["/((?!_next|api|media|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
