import type { Metadata } from "next";
import localFont from 'next/font/local'
import {Instrument_Serif, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "./components/Header";
import { Analytics } from "@vercel/analytics/next"

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: '400',
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const digitalNumbers = localFont({
  src: './fonts/DigitalNumbers-Regular.woff',
  variable: "--font-digital-numbers",
})

export const metadata: Metadata = {
  title: "European Union Fuel Price Explorer",
  description: "Explore European fuel prices, compare countries, and track petrol and diesel price trends over time.",
   robots: {
    index: false,
    follow: false,
  },
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", instrumentSerif.variable, instrumentSans.variable, digitalNumbers.variable, "font-mono", jetbrainsMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Analytics />
        </body>
    </html>
  );
}
