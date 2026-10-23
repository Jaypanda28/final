import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shri PinnakEdge Smart LMS | Your Edge in Every Competition",
  description: "Official Learning Management System and Comprehensive Institute ERP for Shri PinnakEdge Coaching Center — Premier IIT-JEE, NEET-UG & Foundation Academy.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
