'use client';

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveSession } from '@/lib/auth';
import { login } from '@/services/authService';

// Only allow redirects back into this app (blocks "?next=https://evil.com" or "//evil.com").
const safeNext = (next) => (next && next.startsWith('/') && !next.startsWith('//') ? next : '/products');

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const lock = useRef(false);

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (lock.current) return; // ignore extra clicks while a login is in flight

    const next = {};
    if (!values.username.trim()) next.username = 'Enter your username.';
    if (!values.password) next.password = 'Enter your password.';
    setErrors(next);
    if (Object.keys(next).length) return;

    lock.current = true;
    setSubmitting(true);
    setServerError('');
    try {
      const session = await login({ username: values.username.trim(), password: values.password });
      saveSession(session);
      router.replace(safeNext(searchParams.get('next')));
      router.refresh();
      // Stay locked: we're navigating away, so no second request can be sent.
    } catch (err) {
      setServerError(err.status === 400 ? 'Wrong username or password. Check your details and try again.' : err.message);
      lock.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex items-center gap-2 font-semibold">
        <span aria-hidden className="grid h-8 w-8 place-items-center rounded-md bg-brand text-white">P</span>
        Product Admin
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-xl border border-line bg-surface p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Sign in</h1>

        {serverError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">
            {serverError}
          </p>
        )}

        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-medium">Username</label>
          <input id="username" name="username" autoComplete="username" value={values.username} onChange={onChange}
            aria-invalid={!!errors.username} aria-describedby={errors.username ? 'username-error' : undefined}
            className={`input ${errors.username ? 'input-error' : ''}`} />
          {errors.username && <p id="username-error" className="mt-1 text-xs text-danger">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" value={values.password} onChange={onChange}
            aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined}
            className={`input ${errors.password ? 'input-error' : ''}`} />
          {errors.password && <p id="password-error" className="mt-1 text-xs text-danger">{errors.password}</p>}
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-xs text-muted">
          Demo account: <code>emilys</code> / <code>emilyspass</code>{' '}
          <button type="button" className="underline underline-offset-2 hover:text-ink"
            onClick={() => setValues({ username: 'emilys', password: 'emilyspass' })}>
            Fill in
          </button>
        </p>
      </form>
    </div>
  );
}
