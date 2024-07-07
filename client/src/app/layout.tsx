import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Munich City Hospital BOT',
  description: 'Munich City Hospital appointment booking BOT',
  icons: {
    icon: ['/hospital.png'],
    apple: ['/hospital.png'],
    shortcut: ['/hospital.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
