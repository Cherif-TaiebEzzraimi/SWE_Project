import React, { useState, useEffect } from 'react';
import styles from './FreelancerHistory.module.css';

interface Project {
  id: number;
  negotiation: {
    id: number;
    title: string;
    description: string;
    client_id: {
      user: {
        first_name: string;
        last_name: string;
        email: string;
      };
    };
    freelancer_id: {
      user: {
        first_name: string;
        last_name: string;
        email: string;
      };
    };
    final_price: number;
    deadline: string;
    status: string;
  };
  title: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface FreelancerHistoryProps {
  userId: number;
}

const FreelancerHistory: React.FC<FreelancerHistoryProps> = ({ userId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'done'>('done');

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Dummy data for UI preview
      const demo: Project[] = [
        {
          id: 301,
          negotiation: {
            id: 9001,
            title: 'E-commerce frontend build',
            description: 'React storefront for client brand',
            client_id: { user: { first_name: 'Nadia', last_name: 'M.', email: 'nadia@example.com' } },
            freelancer_id: { user: { first_name: 'Ahmed', last_name: 'Benali', email: 'ahmed@example.com' } },
            final_price: 120000,
            deadline: new Date(Date.now() - 10 * 86400000).toISOString(),
            status: 'accepted',
          },
          title: 'E-commerce storefront',
          start_date: new Date(Date.now() - 20 * 86400000).toISOString(),
          end_date: new Date(Date.now() - 12 * 86400000).toISOString(),
          created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
        },
        {
          id: 302,
          negotiation: {
            id: 9002,
            title: 'Internal dashboard',
            description: 'Analytics dashboard for operations',
            client_id: { user: { first_name: 'Karim', last_name: 'S.', email: 'karim@example.com' } },
            freelancer_id: { user: { first_name: 'Ahmed', last_name: 'Benali', email: 'ahmed@example.com' } },
            final_price: 80000,
            deadline: new Date(Date.now() - 30 * 86400000).toISOString(),
            status: 'in_progress',
          },
          title: 'Ops analytics dashboard',
          start_date: new Date(Date.now() - 40 * 86400000).toISOString(),
          end_date: '',
          created_at: new Date(Date.now() - 41 * 86400000).toISOString(),
        },
      ];
      setProjects(demo);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'DZD',
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      done: { label: 'Completed', className: styles.statusCompleted },
      in_progress: { label: 'In Progress', className: styles.statusInProgress },
      pending: { label: 'Pending', className: styles.statusPending },
      accepted: { label: 'Accepted', className: styles.statusCompleted },
    };

    const config = statusConfig[status] || { label: status, className: '' };
    return <span className={`${styles.statusBadge} ${config.className}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className={styles.historyContainer}>
        <div className={styles.loading}>Loading project history...</div>
      </div>
    );
  }

const filteredProjects = filter === 'done'
    ? projects.filter(p => p.negotiation.status === 'accepted') // Projects are created from accepted negotiations
    : projects;

  return (
    <div className={styles.historyContainer}>
      {/* Header with Filter */}
      <div className={styles.header}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{projects.length}</div>
            <div className={styles.statLabel}>Total Projects</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {formatPrice(projects.reduce((sum, p) => sum + (p.negotiation.final_price || 0), 0))}
            </div>
            <div className={styles.statLabel}>Total Earnings</div>
          </div>
        </div>

        <div className={styles.filterButtons}>
          <button 
            className={filter === 'done' ? styles.filterActive : ''}
            onClick={() => setFilter('done')}
          >
            My Projects
          </button>
          <button 
            className={filter === 'all' ? styles.filterActive : ''}
            onClick={() => setFilter('all')}
          >
            All Projects
          </button>
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className={styles.noProjects}>
          <p>No projects found</p>
          <p className={styles.noProjectsSubtext}>
            Your completed projects will appear here once you finish working with clients.
          </p>
        </div>
      ) : (
        <div className={styles.projectsList}>
          {filteredProjects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div>
                  <h3 className={styles.projectTitle}>{project.title || project.negotiation.title}</h3>
                  <div className={styles.projectClient}>
                    Client: {project.negotiation.client_id.user.first_name}{' '}
                    {project.negotiation.client_id.user.last_name}
                  </div>
                </div>
                {getStatusBadge(project.negotiation.status)}
              </div>

              <div className={styles.projectDetails}>
                <div className={styles.projectDetail}>
                  <span className={styles.detailLabel}>Start Date:</span>
                  <span className={styles.detailValue}>{formatDate(project.start_date)}</span>
                </div>
                <div className={styles.projectDetail}>
                  <span className={styles.detailLabel}>End Date:</span>
                  <span className={styles.detailValue}>{formatDate(project.end_date)}</span>
                </div>
                <div className={styles.projectDetail}>
                  <span className={styles.detailLabel}>Price:</span>
                  <span className={styles.detailValue}>{formatPrice(project.negotiation.final_price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerHistory;
