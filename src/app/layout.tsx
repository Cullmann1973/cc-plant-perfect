import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CC Plant Perfect | Manufacturing Performance Intelligence",
  description: "HAL 9000-powered manufacturing analytics for operational reviews and strategy planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-[#e0e0e0] antialiased`}>
        {children}
      </body>
    </html>
  );
}
