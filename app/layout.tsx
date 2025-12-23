import type { Metadata } from "next";
import './styles/globals.css';
import { Rubik } from 'next/font/google';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-rubik',
});

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
        <link  href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"  />
      </head>
      <body className={`${rubik.variable} font-sans bg-neutral--white-200 text-neutral--black-900`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
