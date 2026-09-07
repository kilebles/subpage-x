import type { Metadata } from "next";
import { Work_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TunnelX — Подключение VPN",
  description: "Подключите TunnelX VPN на своём устройстве.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${workSans.variable} ${robotoMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
