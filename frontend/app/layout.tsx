import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Suivi de projets et de tâches", template: "%s · Suivi de projets" },
  description: "Outil interne de suivi des projets et des tâches de l'agence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:shadow-sm"
        >
          Aller au contenu
        </a>
        <div className="lg:flex">
          <AppSidebar />
          {/* min-w-0 lets long titles shrink instead of forcing a horizontal scroll. */}
          <div className="min-w-0 flex-1">
            <AppHeader />
            <main id="main-content" className="mx-auto w-full max-w-3xl px-4 py-6 lg:py-10">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
