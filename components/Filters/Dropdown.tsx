'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Dropdown.module.css';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  placeholder: string;
  options: Option[];
  onChange: (value: string) => void;
}

export default function Dropdown({
  value,
  placeholder,
  options,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const selected = options.find(option => option.value === value);

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={selected ? `${placeholder}: ${selected.label}` : placeholder}
      >
        <span className={selected ? styles.value : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul className={styles.list} role="listbox">
          {options.map(option => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                className={`${styles.option} ${
                  option.value === value ? styles.optionSelected : ''
                }`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
