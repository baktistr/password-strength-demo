import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Password Strength Meter | Privacy Day Workshop',
  description:
    'An interactive demo to learn about password security. Runs entirely in your browser - no data is ever sent or stored.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
