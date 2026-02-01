import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/index.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Email Craft Studio",
  description: "Professional email HTML generator with brand kit system",
  authors: [{ name: "Email Craft Studio" }],
  openGraph: {
    title: "Email Craft Studio",
    description: "Professional email HTML generator with brand kit system",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
