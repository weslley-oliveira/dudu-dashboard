import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import PreventZoom from './ui/PreventZoom';
import type { Viewport } from 'next'
 
export const viewport: Viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale :1, 
  maximumScale:1, 
  userScalable:false,
}

export const metadata: Metadata = {
  title: {
    template: '%s | MotoManage - Alexandre Motorcycles',
    default: ' MotoManage - Alexandre Motorcycles',
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
      <body className={`${inter.className} antialiased`}>
      <PreventZoom>
          {children}
      </PreventZoom>
      </body>
    </html>
  );
}
