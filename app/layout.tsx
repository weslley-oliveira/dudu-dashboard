import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import ZoomPrevention from '@/app/ui/ZoomPrevention'

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ZoomPrevention>
          {children}
        </ZoomPrevention>
      </body>
    </html>
  );
}
