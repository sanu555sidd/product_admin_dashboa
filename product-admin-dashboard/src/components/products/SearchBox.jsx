'use client';

import { useEffect, useRef, useState } from 'react';

const DEBOUNCE_MS = 400;

// Debounced search input.
//  - typing updates the box instantly, but onSearch (which changes the URL and
//    triggers the API call) only fires after the user has paused for DEBOUNCE_MS.
//  - if `value` (from the URL) changes for another reason (Back button, choosing a
//    category), the box follows it.
export default function SearchBox({ value, onSearch }) {
  const [text, setText] = useState(value);
  const timer = useRef(null);
  const lastSent = useRef(value); // the last value WE pushed to the URL
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch; // timer callbacks always call the latest handler

  useEffect(() => {
    if (value !== lastSent.current) {
      clearTimeout(timer.current);
      lastSent.current = value;
      setText(value);
    }
  }, [value]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function handleChange(e) {
    const next = e.target.value;
    setText(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const trimmed = next.trim();
      if (trimmed === lastSent.current) return;
      lastSent.current = trimmed;
      onSearchRef.current(trimmed);
    }, DEBOUNCE_MS);
  }

  return (
    <div>
      <label htmlFor="search" className="sr-only">Search products</label>
      <input id="search" type="search" value={text} onChange={handleChange} placeholder="Search products…" className="input" autoComplete="off" />
    </div>
  );
}
