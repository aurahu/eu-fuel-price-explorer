import type { Metadata } from "next";
import localFont from 'next/font/local'
import {Instrument_Serif, Instrument_Sans } from "next/font/google";
import "./globals.css";

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
  description: "XXX",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${instrumentSans.variable} ${digitalNumbers.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
