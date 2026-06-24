import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import 'modern-normalize/modern-normalize.css';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import TanStackProvider from '../components/TanStackProvider/TanStackProvider';
import AuthProvider from '../components/AuthProvider/AuthProvider';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import SpriteSheet from '../components/SpriteSheet/SpriteSheet';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tasteorama',
  description:
    'Tasteorama — discover, search and save your favorite recipes.',
  openGraph: {
    title: 'Tasteorama',
    description:
      'Tasteorama — discover, search and save your favorite recipes.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <SpriteSheet />
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster position="top-right" />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
