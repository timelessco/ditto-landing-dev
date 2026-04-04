"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Phone, X } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between border-b border-ditto-grey-50 px-6 lg:px-[160px]">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/icons/ditto-logo.svg"
            alt="ditto"
            width={63}
            height={22}
            className="md:h-[29px] md:w-[84px]"
            priority
          />
        </Link>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="relative flex h-11 w-11 cursor-pointer items-center justify-center md:hidden [-webkit-tap-highlight-color:transparent]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((p) => !p)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-ditto-black" />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src="/icons/menu.svg" alt="" width={24} height={24} className="pointer-events-none" />
          )}
        </button>

        {/* Desktop nav + CTA */}
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center gap-2">
            <NavDropdown label="Health Insurance" />
            <NavDropdown label="Term Insurance" />
            <NavLink label="Claims" hasIndicator />
            <NavLink label="Careers" />
          </div>

          <Link
            href="#schedule"
            className="ml-4 flex items-center gap-2 rounded-[14px] bg-ditto-blue px-5 py-2.5 font-heading text-base font-medium text-white shadow-sm transition-colors hover:bg-ditto-blue-dark"
          >
            <Phone className="h-[18px] w-[18px]" />
            Schedule a Call
          </Link>
        </div>
      </div>

      {/* Mobile expand/collapse panel */}
      <div
        className={`grid overflow-hidden border-b border-ditto-grey-50 bg-white transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
          mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 px-6 pt-2 pb-4">
            <MobileNavLink label="Health Insurance" href="?type=health#schedule" onClick={() => setMobileOpen(false)} />
            <MobileNavLink label="Term Insurance" href="?type=term#schedule" onClick={() => setMobileOpen(false)} />
            <MobileNavLink label="Claims" href="#" onClick={() => setMobileOpen(false)} />
            <MobileNavLink label="Careers" href="#" onClick={() => setMobileOpen(false)} />
          </div>
          <div className="px-6 pb-5">
            <Link
              href="#schedule"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ditto-blue px-5 py-3 font-heading text-base font-medium text-white shadow-sm"
              onClick={() => setMobileOpen(false)}
            >
              <Phone className="h-[18px] w-[18px]" />
              Schedule a Call
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavDropdown({ label }: { label: string }) {
  const type = label.toLowerCase().includes("health") ? "health" : "term";
  return (
    <Link
      href={`?type=${type}#schedule`}
      className="flex items-center gap-1 rounded-lg px-4 py-2 font-heading text-base font-medium text-ditto-black transition-colors hover:bg-ditto-grey-100"
    >
      {label}
      <ChevronDown className="h-4 w-4 text-ditto-black" />
    </Link>
  );
}

function NavLink({
  label,
  hasIndicator,
}: {
  label: string;
  hasIndicator?: boolean;
}) {
  return (
    <Link
      href="#"
      className="flex items-center gap-1.5 rounded-lg px-4 py-2 font-heading text-base font-medium text-ditto-grey-900 transition-colors hover:bg-ditto-grey-100"
    >
      {hasIndicator && (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ditto-blue" />
      )}
      {label}
    </Link>
  );
}

function MobileNavLink({ label, href, onClick }: { label: string; href: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-lg px-2 py-3 font-heading text-base font-medium text-ditto-black active:bg-ditto-grey-100"
    >
      {label}
    </Link>
  );
}
