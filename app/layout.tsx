import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | MotoManage - Alexandre Motorcycles',
    default: ' MotoManage - Alexandre Motorcycles',
  },
  description: 'MotoManage oferece uma solução robusta para gestão de oficinas de motos.',
  metadataBase: new URL('https://alexandremotorcycles.app/'),
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
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
