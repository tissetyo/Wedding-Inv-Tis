import type { Metadata } from "next";
import { Lora, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";
import { supabase } from "@/lib/supabase";
import defaultData from "@/data/content.json";

const lora = Lora({ subsets: ["latin"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-serif" });
const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-script" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://wedding-titis-tyara.vercel.app"),
  title: "The Wedding Of Titis & Tyara",
  description: "Wedding Invitation Titis & Tyara",
  openGraph: {
    title: "The Wedding Of Titis & Tyara",
    description: "Wedding Invitation Titis & Tyara",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1254,
        height: 1254,
        alt: "Titis & Tyara Wedding Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Wedding Of Titis & Tyara",
    description: "Wedding Invitation Titis & Tyara",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Graceful fetch connecting to Supabase LIVE configuration block
  let content = defaultData;
  try {
    const { data, error } = await supabase.from("site_settings").select("payload").eq("id", 1).single();
    if (data && data.payload) {
      content = data.payload as any;
    }
  } catch (err) {
    console.error("Failed to load DB theme, falling back to JSON");
  }

  const themeVars = {
    "--color-bg": content.theme.global.primaryBg,
    "--color-text": content.theme.global.textColor,
    "--color-accent": content.theme.global.accentColor,
    "--base-radius": content.theme.global.baseRadius,
  } as React.CSSProperties;

  return (
    <html lang="en" className="dark scroll-smooth" style={themeVars}>
      <body className={`${lora.variable} ${cormorant.variable} ${vibes.variable} antialiased selection:bg-[var(--color-accent)]/30`}>
        <main className="mx-auto max-w-md w-full min-h-screen relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
          {children}
        </main>
      </body>
    </html>
  );
}
