import styles from '../styles/projectProgress.module.css';

interface UserProfileCardProps {
  name: string;
  role: string;
  photo: string;
  type: 'client' | 'freelancer';
}

export function UserProfileCard({ name, role, photo, type }: UserProfileCardProps) {
  const label = type === 'freelancer' ? 'ASSIGNED FREELANCER' : 'ASSIGNED CLIENT';
  
  return (
    <div className={styles.card}>
      <div className={styles.freelancerCard}>
        {photo ? (
          <img 
            src={photo} 
            alt={name}
            className={styles.profilePhoto}
          />
        ) : (
          <div className={styles.profilePhotoPlaceholder}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#9ca3af"/>
            </svg>
          </div>
        )}
        <div className={styles.freelancerInfo}>
          <span className={styles.label}>{label}</span>
          <h3 className={styles.freelancerName}>{name}</h3>
          <p className={styles.freelancerRole}>{role}</p>
          <button className={styles.viewProfileBtn}>View Profile</button>
        </div>
      </div>
    </div>
  );
}
