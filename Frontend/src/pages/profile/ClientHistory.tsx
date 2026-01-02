import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FreelancerHistory.module.css';
import { getUserProjects } from '../../api/projectApi';

interface ClientHistoryProps {
  userId: number;
}

interface ClientProjectItem {
  id: number;
  negotiation: {
    id: number;
    title: string;
    description: string;
    client: { user: { first_name: string; last_name: string; email: string } };
    freelancer?: { user: { first_name: string; last_name: string; email: string } };
    status: 'open' | 'accepted' | 'in_progress' | 'done' | 'cancelled' | string;
    created_at: string;
    deadline?: string | null;
  };
}

const ClientHistory: React.FC<ClientHistoryProps> = ({ userId }) => {
  const [projects, setProjects] = useState<ClientProjectItem[]>([]);
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
      const transformedProjects: ClientProjectItem[] = projectsData.map((project) => {
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
            status: negotiation.status,
            created_at: negotiation.created_at,
            deadline: null, // Deadline not in negotiation model, would need to be added
          },
        };
      });
      
      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching client projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      done: { label: 'Completed', className: styles.statusCompleted },
      in_progress: { label: 'In Progress', className: styles.statusInProgress },
      pending: { label: 'Pending', className: styles.statusPending },
      accepted: { label: 'Accepted', className: styles.statusPending },
      open: { label: 'Open', className: styles.statusPending },
      cancelled: { label: 'Cancelled', className: styles.statusPending },
    };

    const config = statusConfig[status] || { label: status, className: '' };
    return <span className={`${styles.statusBadge} ${config.className}`}>{config.label}</span>;
  };

  const filteredProjects =
    filter === 'done'
      ? projects.filter((p) =>
          ['accepted', 'in_progress', 'done'].includes(p.negotiation.status)
        )
      : projects;

  if (loading) {
    return (
      <div className={styles.historyContainer}>
        <div className={styles.loading}>Loading project history...</div>
      </div>
    );
  }

  return (
    <div className={styles.historyContainer}>
      {/* Header with Filter */}
      <div className={styles.header}>
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
            Your posted and accepted projects will appear here.
          </p>
        </div>
      ) : (
        <div className={styles.projectsList}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={styles.projectCard}
              onClick={() =>
                navigate(`/project-progress?tab=overview&projectId=${project.id}&negotiationId=${project.negotiation.id}`, {
                  state: {
                    negotiationId: project.negotiation.id,
                    projectId: project.id,
                  }
                })
              }
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.projectHeader}>
                <div>
                  <h3 className={styles.projectTitle}>
                    {project.negotiation.title}
                  </h3>

                  {project.negotiation.freelancer?.user && (
                    <div className={styles.projectClient}>
                      Freelancer:{' '}
                      {project.negotiation.freelancer.user.first_name}{' '}
                      {project.negotiation.freelancer.user.last_name}
                    </div>
                  )}
                </div>

                {getStatusBadge(project.negotiation.status)}
              </div>

              <div className={styles.projectDetails}>
                <div className={styles.projectDetail}>
                  <span className={styles.detailLabel}>Created:</span>
                  <span className={styles.detailValue}>
                    {formatDate(project.negotiation.created_at)}
                  </span>
                </div>

                <div className={styles.projectDetail}>
                  <span className={styles.detailLabel}>Deadline:</span>
                  <span className={styles.detailValue}>
                    {formatDate(project.negotiation.deadline || '')}
                  </span>
                </div>
                {/* Client view intentionally omits Price */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientHistory;
