import type { Metadata } from "next";
import { Lora, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "The Wedding Of",
  description: "Wedding Invitation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${lora.variable} ${cormorant.variable} antialiased selection:bg-[#D4AF37]/30`}
      >
        <main className="mx-auto max-w-md w-full min-h-screen relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden bg-stone-900 text-stone-300">
          {children}
        </main>
      </body>
    </html>
  );
}
