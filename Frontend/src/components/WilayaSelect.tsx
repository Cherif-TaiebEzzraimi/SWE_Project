import React, { useState } from 'react';
import { wilayas } from '../lib/wilayas.ts';
import styles from '../pages/authentication/SignupFreelancer.module.css';

interface WilayaSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement> | string) => void;
  error?: string;
  disabled?: boolean;
}

const WilayaSelect: React.FC<WilayaSelectProps> = ({ value, onChange, error, disabled }) => {
  const [search, setSearch] = useState('');
  const filteredWilayas = wilayas.filter(w => w.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        placeholder="Search wilaya..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className={styles.selectSearch}
        style={{
          width: '100%',
          padding: '0.6rem 1.5rem 0.6rem 2.25rem',
          fontSize: '1rem',
          border: error ? '2px solid #dc2626' : '1px solid #dddddd',
          borderRadius: '8px',
          marginBottom: '0.5rem',
          outline: 'none',
        }}
        disabled={disabled}
      />
      <select
        name="wilaya"
        value={value}
        onChange={onChange}
        className={styles.select}
        style={{ width: '100%', fontSize: '1rem', border: error ? '2px solid #dc2626' : '1px solid #dddddd', borderRadius: '8px', outline: 'none', height: '44px' }}
        disabled={disabled}
      >
        <option value="">Select Wilaya</option>
        {filteredWilayas.map(w => (
          <option key={w.id} value={w.name}>{w.name}</option>
        ))}
      </select>
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

export default WilayaSelect;
