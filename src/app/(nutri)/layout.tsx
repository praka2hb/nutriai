import "../globals.css"
import AppBar from '@/components/AppBar';
import { Toaster } from 'sonner';


export default function NutriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="nutri-layout">
      <Toaster />
      <AppBar />
      {children}
    </div>
  );
}

