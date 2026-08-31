import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Concierge Audit OS — STR Revenue & Multi-Agent Optimization Engine',
  description: 'Automated 3-agent pipeline for short-term rental revenue audits, high-CTR OTA copywriting, and channel manager synchronization.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
