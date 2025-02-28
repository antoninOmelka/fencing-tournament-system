import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/global/global.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DuelBoard",
  description: "Fencing tournament system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="header">
          <h1>DuelBoard</h1>
        </header>
        <nav className="navbar">
          <ul>
            <li><Link href="/">Participants</Link></li>
            <li><Link href="/group-matches-overview">Groups</Link></li>
            <li><Link href="/results-overview">Results</Link></li>
          </ul>
        </nav>
        <main>
          {children}
        </main>
        <footer className="footer">
          <p>&copy; DuelBoard</p>
        </footer>
      </body>
    </html>
  );
}
