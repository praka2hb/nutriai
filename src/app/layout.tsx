import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Provider';

export const metadata: Metadata = {
  title: 'Nutri AI',
  description: 'AI-powered nutrition planning app',
  icons: {
    icon:"/leafarc.ico",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}

