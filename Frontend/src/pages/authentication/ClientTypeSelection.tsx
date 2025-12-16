import React, { useState } from 'react';
import LogoText from '../../assets/logo/LogoText.svg';
import { useNavigate } from 'react-router-dom';
import styles from './SelectRole.module.css';

type ClientType = 'individual' | 'company' | null;

const ClientTypeSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ClientType>(null);

  const handleContinue = () => {
    if (!selectedType) return;
    if (selectedType === 'individual') {
      navigate('/signup/client/individual');
    } else {
      navigate('/signup/client/company');
    }
  };

  return (
    <>
      {/* Header (copied from SelectRole, but button navigates to /signup/freelancer) */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.logo}>
            <img src={LogoText} alt="Skillink Logo" style={{ height: 48 }} />
          </span>
          <div className={styles.headerLinks}>
            <span className={styles.headerText}>Looking for work?</span>
            <button
              className={styles.headerLink}
              onClick={() => navigate('/signup/freelancer')}
            >
              Apply as a Freelancer
            </button>
          </div>
        </div>
      </header>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Select Client Type</h1>
          <div className={styles.cardsContainer}>
            {/* Individual Card */}
            <div
              className={`${styles.card} ${selectedType === 'individual' ? styles.cardSelected : ''}`}
              onClick={() => setSelectedType('individual')}
            >
              <div className={styles.radioButton}>
                {selectedType === 'individual' && <div className={styles.radioButtonInner} />}
              </div>
              <div className={styles.icon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className={styles.cardText}>I'm an individual</p>
            </div>

            {/* Company Card */}
            <div
              className={`${styles.card} ${selectedType === 'company' ? styles.cardSelected : ''}`}
              onClick={() => setSelectedType('company')}
            >
              <div className={styles.radioButton}>
                {selectedType === 'company' && <div className={styles.radioButtonInner} />}
              </div>
              <div className={styles.icon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M16 3v4M8 3v4" />
                </svg>
              </div>
              <p className={styles.cardText}>I'm a company</p>
            </div>
          </div>
          <button
            onClick={handleContinue}
            disabled={!selectedType}
            className={styles.continueButton}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default ClientTypeSelection;