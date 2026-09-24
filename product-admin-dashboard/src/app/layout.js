import { Public_Sans } from 'next/font/google';
import './globals.css';

const font = Public_Sans({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Product Admin',
  description: 'Manage products: search, filter, sort, add, edit and delete.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
