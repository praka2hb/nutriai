import { Inter } from 'next/font/google';
import "../globals.css"
import AppBar from '@/components/AppBar';
import { Toaster } from 'sonner';
const inter = Inter({ subsets: ['latin'] });


export default function NutriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <Toaster />
          <AppBar />
          {children}
      </body>
    </html>
  );
}

