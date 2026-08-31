"use client";

import "@/app/styles/global/global.css";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/participants", label: "Participants" },
  { href: "/groups", label: "Groups" },
  { href: "/results", label: "Group Results" },
  { href: "/playoff", label: "Playoff" },
  { href: "/playoff-results", label: "Playoff Results" },
];

// exact match or a nested page like /groups/1 — a plain prefix check would
// also light up Playoff on /playoff-results
function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Navbar() {
  const pathname = usePathname() || "";

  return (
    <nav className="navbar">
      <ul>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={isActive(pathname, link.href) ? "active" : ""}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
