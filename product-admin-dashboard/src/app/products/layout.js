import Header from '@/components/layout/Header';
import { LocalChangesProvider } from '@/context/LocalChangesContext';
import { ToastProvider } from '@/context/ToastContext';

export default function ProductsLayout({ children }) {
  return (
    <ToastProvider>
      <LocalChangesProvider>
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
      </LocalChangesProvider>
    </ToastProvider>
  );
}
