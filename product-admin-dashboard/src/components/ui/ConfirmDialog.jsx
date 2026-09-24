'use client';

import { useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';

// Confirm popup. onConfirm may be async; the button locks while it runs so a
// double click can't fire the action twice.
export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false); // a ref updates instantly; state would lag one render

  async function handleConfirm() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      lock.current = false;
      setBusy(false);
    }
  }

  return (
    <Modal title={title} size="sm" onClose={busy ? () => {} : onCancel}>
      <div className="space-y-4 px-5 py-5">
        <p className="text-sm text-ink">{message}</p>
        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={handleConfirm} disabled={busy}>
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
