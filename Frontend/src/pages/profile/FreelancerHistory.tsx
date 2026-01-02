import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FreelancerHistory.module.css';
import { getUserProjects } from '../../api/projectApi';

// Backend-aligned structures: history items are derived from negotiations
interface Negotiation {
  id: number;
  title: string;
  description: string;
  client: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  freelancer: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  final_price: number | null;
  deadline: string | null;
  status: 'accepted' | 'in_progress' | 'done' | string;
}

interface WorkItem {
  id: number;
  negotiation: Negotiation;
  created_at: string;
  start_date?: string;
  end_date?: string;
}

interface FreelancerHistoryProps {
  userId: number;
}

const FreelancerHistory: React.FC<FreelancerHistoryProps> = ({ userId }) => {
  const [projects, setProjects] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'done'>('done');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getUserProjects(userId);
      
      // Transform backend data to match the component's expected format
      const transformedProjects: WorkItem[] = projectsData.map((project) => {
        const negotiation = project.negotiation;
        // Use project title if available, otherwise extract from client_description
        const description = negotiation.client_description || '';
        let title = project.title || `Project #${negotiation.id}`;
        if (!project.title && description) {
          const titleMatch = description.match(/Project Title:\s*(.+?)(?:\n|$)/i);
          if (titleMatch) {
            title = titleMatch[1].trim();
          }
        }
        
        return {
          id: project.id,
          negotiation: {
            id: negotiation.id,
            title: title,
            description: description,
            client: {
              user: {
                first_name: negotiation.client?.user?.first_name || '',
                last_name: negotiation.client?.user?.last_name || '',
                email: negotiation.client?.user?.email || '',
              },
            },
            freelancer: negotiation.freelancer ? {
              user: {
                first_name: negotiation.freelancer.user?.first_name || '',
                last_name: negotiation.freelancer.user?.last_name || '',
                email: negotiation.freelancer.user?.email || '',
              },
            } : undefined,
            final_price: null, // Would need to be added to negotiation model
            deadline: null, // Deadline not in negotiation model
            status: negotiation.status,
          },
          created_at: negotiation.created_at,
        };
      });
      
      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
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
      accepted: { label: 'Accepted', className: styles.statusPending },
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
  ? projects.filter(p => ['accepted', 'in_progress', 'done'].includes(p.negotiation.status))
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
            <div
              key={project.id}
              className={styles.projectCard}
              onClick={() => navigate(`/project-progress?tab=overview&projectId=${project.id}&negotiationId=${project.negotiation.id}`, {
                state: {
                  negotiationId: project.negotiation.id,
                  projectId: project.id,
                }
              })}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.projectHeader}>
                <div>
                  <h3 className={styles.projectTitle}>{project.negotiation.title}</h3>
                  <div className={styles.projectClient}>
                    Client: {project.negotiation.client.user.first_name}{' '}
                    {project.negotiation.client.user.last_name}
                  </div>
                </div>
                {getStatusBadge(project.negotiation.status)}
              </div>

              <div className={styles.projectDetails}>
                <div className={styles.projectDetail}>
                  <span className={styles.detailLabel}>Created:</span>
                  <span className={styles.detailValue}>{formatDate(project.created_at)}</span>
                </div>
                <div className={styles.projectDetail}>
                  <span className={styles.detailLabel}>Deadline:</span>
                  <span className={styles.detailValue}>{formatDate(project.negotiation.deadline || '')}</span>
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
