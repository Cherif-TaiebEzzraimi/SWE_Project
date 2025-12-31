import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SelectRole.module.css';

type RoleType = 'client' | 'freelancer' | null;

const SelectRole: React.FC = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<RoleType>(null);

    const handleContinue = () => {
        if (!selectedRole) return;

        if (selectedRole === 'freelancer') {
            navigate('/signup/freelancer');
        } else if (selectedRole === 'client') {
            navigate('/signup/client-type');
        }
    };

    const getButtonText = () => {
        if (selectedRole === 'client') return 'Join as a Client';
        if (selectedRole === 'freelancer') return 'Apply as a Freelancer';
        return 'Create Account';
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Join as a client or freelancer</h1>

                <div className={styles.cardsContainer}>
                    {/* Client Card */}
                    <div
                        className={`${styles.card} ${selectedRole === 'client' ? styles.cardSelected : ''}`}
                        onClick={() => setSelectedRole('client')}
                    >
                        <div className={styles.radioButton}>
                            {selectedRole === 'client' && <div className={styles.radioButtonInner} />}
                        </div>
                        <div className={styles.icon}>
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <p className={styles.cardText}>I'm a client, hiring for a project</p>
                    </div>

                    {/* Freelancer Card */}
                    <div
                        className={`${styles.card} ${selectedRole === 'freelancer' ? styles.cardSelected : ''}`}
                        onClick={() => setSelectedRole('freelancer')}
                    >
                        <div className={styles.radioButton}>
                            {selectedRole === 'freelancer' && <div className={styles.radioButtonInner} />}
                        </div>
                        <div className={styles.icon}>
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <p className={styles.cardText}>I'm a freelancer, looking for work</p>
                    </div>
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!selectedRole}
                    className={styles.continueButton}
                >
                    {getButtonText()}
                </button>

                <p className={styles.loginLink}>
                    Already have an account?{' '}
                    <button onClick={handleLogin} className={styles.linkButton}>
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SelectRole;