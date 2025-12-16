import React, { useEffect, useState } from 'react';
import styles from './FreelancerHistory.module.css';

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

	useEffect(() => {
		fetchProjects();
	}, [userId]);

	const fetchProjects = async () => {
		try {
			setLoading(true);
			// TODO: Replace with GET /clients/{userId}/projects
			const demo: ClientProjectItem[] = [
				{
					id: 401,
					negotiation: {
						id: 9101,
						title: 'E-commerce storefront',
						description: 'React storefront for brand',
						client: { user: { first_name: 'Sara', last_name: 'K.', email: 'sara@example.com' } },
						freelancer: { user: { first_name: 'Nadia', last_name: 'M.', email: 'nadia@example.com' } },
						status: 'accepted',
						created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
						deadline: new Date(Date.now() - 12 * 86400000).toISOString(),
					},
				},
				{
					id: 402,
					negotiation: {
						id: 9102,
						title: 'Mobile App MVP',
						description: 'Initial MVP for mobile app',
						client: { user: { first_name: 'Sara', last_name: 'K.', email: 'sara@example.com' } },
						freelancer: { user: { first_name: 'Yacine', last_name: 'B.', email: 'yacine@example.com' } },
						status: 'in_progress',
						created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
						deadline: '',
					},
				},
				{
					id: 403,
					negotiation: {
						id: 9103,
						title: 'Data Analysis Dashboard',
						description: 'Dashboard spec and posting',
						client: { user: { first_name: 'Sara', last_name: 'K.', email: 'sara@example.com' } },
						status: 'open',
						created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
						deadline: '',
					},
				},
			];
			setProjects(demo);
		} catch (error) {
			console.error('Error fetching client projects:', error);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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

	const filteredProjects = filter === 'done'
		? projects.filter(p => ['accepted', 'in_progress', 'done'].includes(p.negotiation.status))
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
						<div key={project.id} className={styles.projectCard}>
							<div className={styles.projectHeader}>
								<div>
									<h3 className={styles.projectTitle}>{project.negotiation.title}</h3>
									{project.negotiation.freelancer?.user && (
										<div className={styles.projectClient}>
											Freelancer: {project.negotiation.freelancer.user.first_name}{' '}
											{project.negotiation.freelancer.user.last_name}
										</div>
									)}
								</div>
								{getStatusBadge(project.negotiation.status)}
							</div>

							<div className={styles.projectDetails}>
								<div className={styles.projectDetail}>
									<span className={styles.detailLabel}>Created:</span>
									<span className={styles.detailValue}>{formatDate(project.negotiation.created_at)}</span>
								</div>
								<div className={styles.projectDetail}>
									<span className={styles.detailLabel}>Deadline:</span>
									<span className={styles.detailValue}>{formatDate(project.negotiation.deadline || '')}</span>
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
