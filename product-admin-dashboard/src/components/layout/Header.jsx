'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocalChanges } from '@/context/LocalChangesContext';
import { useToast } from '@/context/ToastContext';
import { clearSession, getUser } from '@/lib/auth';

export default function Header() {
  const router = useRouter();
  const toast = useToast();
  const { changes, dispatch } = useLocalChanges();
  const [user, setUser] = useState(null);

  // localStorage only exists in the browser, so read it after mount.
  useEffect(() => setUser(getUser()), []);

  const pending = changes.added.length + Object.keys(changes.edited).length + Object.keys(changes.deleted).length;

  function logout() {
    clearSession();
    router.replace('/login');
    router.refresh();
  }

  function discard() {
    dispatch({ type: 'reset' });
    toast.show('Local changes discarded.');
  }

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/products" className="flex items-center gap-2 font-semibold">
          <span aria-hidden className="grid h-7 w-7 place-items-center rounded-md bg-brand text-sm text-white">P</span>
          Product Admin
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {pending > 0 && (
            <button type="button" onClick={discard} className="hidden text-muted underline underline-offset-2 hover:text-ink sm:inline">
              Discard {pending} local {pending === 1 ? 'change' : 'changes'}
            </button>
          )}
          {user && <span className="hidden text-muted sm:inline">Signed in as {user.username}</span>}
          <button type="button" onClick={logout} className="btn btn-secondary btn-sm">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
