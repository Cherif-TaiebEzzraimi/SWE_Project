import React, { useMemo, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  withPasswordToggle?: boolean;
}

const Input: React.FC<InputProps> = ({ label, error, withPasswordToggle, ...props }) => {
  const { type, style, ...rest } = props;
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  const inputType = useMemo(() => {
    if (!isPassword) return type;
    if (!withPasswordToggle) return 'password';
    return showPassword ? 'text' : 'password';
  }, [isPassword, type, showPassword, withPasswordToggle]);

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
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type={inputType}
          {...rest}
          style={{
            width: '100%',
            padding: '0.75rem',
            paddingRight: isPassword && withPasswordToggle ? '2.75rem' : '0.75rem',
            fontSize: '1rem',
            border: error ? '2px solid #dc2626' : '1px solid #dddddd',
            borderRadius: '8px',
            outline: 'none',
            transition: 'border-color 0.2s',
            ...style,
          }}
        />

        {isPassword && withPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              color: '#6b7280',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {showPassword ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.69-1.58 1.71-3.03 2.95-4.24M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-1.05 2.41-2.76 4.47-4.9 6.06" />
                <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                <path d="M1 1l22 22" />
              </svg>
            )}
          </button>
        )}
      </div>
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