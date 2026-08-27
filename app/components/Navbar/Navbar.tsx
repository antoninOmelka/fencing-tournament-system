"use client";

import "@/app/styles/global/global.css";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/participants", label: "Participants" },
  { href: "/groups", label: "Groups" },
  { href: "/results", label: "Results" },
  { href: "/playoff", label: "Playoff" },
];

function Navbar() {
  // startsWith keeps the tab active on nested pages like /groups/1
  const pathname = usePathname() || "";

  return (
    <nav className="navbar">
      <ul>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={pathname.startsWith(link.href) ? "active" : ""}
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
