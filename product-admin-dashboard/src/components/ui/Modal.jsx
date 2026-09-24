'use client';

import { useEffect, useRef } from 'react';

const WIDTHS = { sm: 'sm:max-w-md', lg: 'sm:max-w-2xl' };

export default function Modal({ title, onClose, size = 'lg', children }) {
  const panelRef = useRef(null);
  // Keep the latest onClose in a ref so the effect below only runs once
  // (otherwise it would re-focus the dialog on every parent re-render).
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-surface shadow-xl outline-none sm:rounded-xl ${WIDTHS[size]}`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-md px-2 text-2xl leading-none text-muted hover:bg-brand-soft">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
