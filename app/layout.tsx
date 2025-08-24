import '@coinbase/onchainkit/styles.css';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
export const metadata: Metadata = {
  title: "base-Bubbly",
  icons: {
    icon: "/BUBBLY.ico", 
    shortcut: "/BUBBLY.ico", 
    apple: "/BUBBLY.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background dark">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
