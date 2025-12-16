import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div style={{ marginBottom: '1rem', width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#333',
          }}
        >
          {label}
        </label>
      )}
      <input
        type={props.type}
        {...props}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          border: error ? '2px solid #dc2626' : '1px solid #dddddd',
          borderRadius: '8px',
          outline: 'none',
          transition: 'border-color 0.2s',
          ...props.style,
        }}
      />
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#dc2626',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            style={{ flexShrink: 0 }}
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M8 4v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;