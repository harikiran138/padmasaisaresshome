import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { CartProvider } from "@/components/shared/CartProvider";
import { SessionProvider } from "@/components/shared/SessionProvider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Padma Sai Sarees Home",
  description: "Everyday fashion. Everyday you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased font-sans flex flex-col min-h-screen`}>
        <CartProvider>
          <SessionProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </SessionProvider>
        </CartProvider>
      </body>
    </html>
  );
}
