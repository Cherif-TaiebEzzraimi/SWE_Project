import { ProjectHeader } from './ProjectHeader';
import { UserProfileCard } from './UserProfileCard';
import styles from '../styles/projectProgress.module.css';

interface ProjectCardProps {
  projectTitle: string;
  projectDescription: string;
  submittedOn: string;
  budget: string;
  userType: 'client' | 'freelancer';
  userName: string;
  userRole: string;
  userPhoto: string;
  children?: React.ReactNode;
}

export function ProjectCard({
  projectTitle,
  projectDescription,
  submittedOn,
  budget,
  userType,
  userName,
  userRole,
  userPhoto,
  children
}: ProjectCardProps) {
  return (
    <>
      {/* project description card */}
      <ProjectHeader 
        title={projectTitle}
        description={projectDescription}
        submittedOn={submittedOn}
        budget={budget}
      />

      {/*  user profil card */}
      <div className={styles.twoColumnLayout}>
        {/* up card */}
        <UserProfileCard 
          name={userName}
          role={userRole}
          photo={userPhoto}
          type={userType}
        />

        {/*  (files, upload, ....) */}
        {children}
      </div>
    </>
  );
}
