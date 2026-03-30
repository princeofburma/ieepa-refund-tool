import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IEEPA Tariff Refund Tool | Recover Your Customs Duties',
  description:
    'The Supreme Court struck down IEEPA tariffs. $166B in refunds are owed to US importers. Upload your ACE entry data and get a CAPE-ready filing package in minutes.',
  keywords: 'IEEPA tariff refund, customs duty refund, CAPE portal, importer refund',
  openGraph: {
    title: 'IEEPA Tariff Refund Tool',
    description: 'Recover your IEEPA customs duties. Get a CAPE-ready filing package in minutes.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased" style={{ backgroundColor: '#0a1628', color: '#f0f4f8' }}>
        {children}
      </body>
    </html>
  );
}
