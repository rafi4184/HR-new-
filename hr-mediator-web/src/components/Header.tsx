"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/events", label: "Events" },
  { href: "/track", label: "Track request" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/logo-icon.png" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-display text-lg font-semibold text-navy">HR — The Mediator</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm transition-colors hover:text-navy ${
                pathname.startsWith(n.href) ? "font-medium text-navy" : "text-muted"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link href="/request" className="btn-primary">
            Make a request
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-navy md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper md:hidden">
          <div className="container-page flex flex-col py-3">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2.5 text-ink">
                {n.label}
              </Link>
            ))}
            <Link href="/request" onClick={() => setOpen(false)} className="btn-primary mt-2">
              Make a request
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
