import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const revalidate = 300;

export const metadata: Metadata = {
  title: { default: "HR — The Mediator", template: "%s · HR — The Mediator" },
  description:
    "Bangladesh concierge desk: airport VIP reception, hotel & car booking, government requests, and courses & careers support.",
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
