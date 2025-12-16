import React, { useState, useRef, useEffect } from 'react';
import { wilayas } from '../lib/wilayas.ts';
import styles from '../pages/authentication/SignupFreelancer.module.css';

interface WilayaDropdownProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const WilayaDropdown: React.FC<WilayaDropdownProps> = ({ value, onChange, error, disabled }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const filteredWilayas = wilayas.filter(w => w.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        className={styles.select}
        style={{
          width: '100%',
          textAlign: 'left',
          background: '#fff',
          border: error ? '2px solid #dc2626' : '1px solid #dddddd',
          borderRadius: '8px',
          padding: '0.75rem',
          fontSize: '1rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: value ? '#172554' : '#888',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
      >
        {value || 'Select Wilaya'}
        <span style={{ marginLeft: 'auto', color: '#888', fontSize: '1.1em' }}>▼</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            width: '100%',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            zIndex: 10,
            padding: '0.5rem 0',
            maxHeight: 260,
            overflowY: 'auto',
          }}
        >
          <input
            type="text"
            autoFocus
            placeholder="Search wilaya..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '92%',
              margin: '0.5rem 4%',
              padding: '0.5rem 0.75rem',
              fontSize: '1rem',
              border: '1px solid #dddddd',
              borderRadius: '8px',
              outline: 'none',
              marginBottom: '0.5rem',
              background: '#f9fafb',
            }}
            disabled={disabled}
          />
          {filteredWilayas.length === 0 && (
            <div style={{ padding: '0.75rem', color: '#888', textAlign: 'center' }}>No wilaya found</div>
          )}
          {filteredWilayas.map(w => (
            <div
              key={w.id}
              onClick={() => {
                onChange(w.name);
                setOpen(false);
                setSearch('');
              }}
              style={{
                padding: '0.65rem 1.25rem',
                cursor: 'pointer',
                background: value === w.name ? '#f1f5f9' : 'transparent',
                color: value === w.name ? '#0a65f1' : '#172554',
                fontWeight: value === w.name ? 600 : 400,
                border: 'none',
                textAlign: 'left',
                fontSize: '1rem',
              }}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onChange(w.name);
                  setOpen(false);
                  setSearch('');
                }
              }}
            >
              {w.name}
            </div>
          ))}
        </div>
      )}
      {error && (
        <div className={styles.error}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }}>
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M8 4v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default WilayaDropdown;
