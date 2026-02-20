import type { Metadata, Viewport } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Yardım Dernekleri Platformu",
  description: "Derneklerin bağış ve yardım ilanları bulabileceği, WhatsApp destekli PWA uygulaması.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Yardım Platformu",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Inter Font via Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-primary selection:text-white">
        {/* Background gradient effects */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary opacity-20 dark:opacity-10 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute top-[40%] right-[-10%] w-96 h-96 bg-accent opacity-20 dark:opacity-10 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        </div>

        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 glass-panel border-b border-white/20 dark:border-white/10 px-4 py-3 shadow-[var(--shadow-glass)] flex items-center justify-between transition-all">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-md">
                YP
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-tight">
                Yardım Platformu
              </h1>
            </div>
          </header>

          <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in-up">
            {children}
          </main>

          <footer className="mt-auto py-6 border-t border-black/10 dark:border-white/10 glass-panel">
            <div className="max-w-5xl mx-auto px-4 text-center text-sm opacity-60">
              © {new Date().getFullYear()} Yardım Platformu. Tüm hakları saklıdır.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
