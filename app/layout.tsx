import type { Metadata } from "next";
import './globals.css';
export const metadata: Metadata = {
  title: "SmartPiggy",
  description: "SmartPiggy - Your Personal Finance Companion",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
