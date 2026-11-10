"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { locales, type Locale } from "@/i18n/config";

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav className="langs" aria-label="Language">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}${search ? `?${search}` : ""}`}
          hrefLang={l}
          aria-current={l === current}
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}
