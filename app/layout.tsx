import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "UNMAPPED",
  description:
    "UNMAPPED turns real-world experience into trusted skill signals for youth, employers, and policymakers."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-[var(--font-body)] text-ink antialiased">{children}</body>
    </html>
  );
}
