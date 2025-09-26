import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { env } from "@/lib/env"; // Validate environment variables at startup

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CoinAds - Self-Serve Crypto Ad Platform",
  description: "The leading self-serve advertising platform for crypto and blockchain companies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
