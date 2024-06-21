import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | MotoManage - Alenxadre Motorcycles',
    default: ' MotoManage - Alenxadre Motorcycles',
  },
  description: 'MotoManage oferece uma solução robusta para gestão de oficinas de motos.',
  metadataBase: new URL('https://alexandremotorcycles.app/'),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
