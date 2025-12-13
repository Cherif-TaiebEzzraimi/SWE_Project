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
		client_id: { user: { first_name: string; last_name: string; email: string } };
		freelancer_id?: { user: { first_name: string; last_name: string; email: string } };
		status: string; // accepted | in_progress | open | cancelled | done
	};
	title: string;
	start_date: string;
	end_date: string;
	created_at: string;
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
						client_id: { user: { first_name: 'Sara', last_name: 'K.', email: 'sara@example.com' } },
						freelancer_id: { user: { first_name: 'Nadia', last_name: 'M.', email: 'nadia@example.com' } },
						status: 'accepted',
					},
					title: 'E-commerce storefront',
					start_date: new Date(Date.now() - 20 * 86400000).toISOString(),
					end_date: new Date(Date.now() - 12 * 86400000).toISOString(),
					created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
				},
				{
					id: 402,
					negotiation: {
						id: 9102,
						title: 'Mobile App MVP',
						description: 'Initial MVP for mobile app',
						client_id: { user: { first_name: 'Sara', last_name: 'K.', email: 'sara@example.com' } },
						freelancer_id: { user: { first_name: 'Yacine', last_name: 'B.', email: 'yacine@example.com' } },
						status: 'in_progress',
					},
					title: 'Mobile App MVP',
					start_date: new Date(Date.now() - 10 * 86400000).toISOString(),
					end_date: '',
					created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
				},
				{
					id: 403,
					negotiation: {
						id: 9103,
						title: 'Data Analysis Dashboard',
						description: 'Dashboard spec and posting',
						client_id: { user: { first_name: 'Sara', last_name: 'K.', email: 'sara@example.com' } },
						status: 'open',
					},
					title: 'Data Analysis Dashboard',
					start_date: '',
					end_date: '',
					created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
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
			accepted: { label: 'Accepted', className: styles.statusCompleted },
			open: { label: 'Open', className: styles.statusPending },
			cancelled: { label: 'Cancelled', className: styles.statusPending },
		};
		const config = statusConfig[status] || { label: status, className: '' };
		return <span className={`${styles.statusBadge} ${config.className}`}>{config.label}</span>;
	};

	const filteredProjects = filter === 'done'
		? projects.filter(p => p.negotiation.status === 'accepted')
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
									<h3 className={styles.projectTitle}>{project.title || project.negotiation.title}</h3>
									{project.negotiation.freelancer_id?.user && (
										<div className={styles.projectClient}>
											Freelancer: {project.negotiation.freelancer_id.user.first_name}{' '}
											{project.negotiation.freelancer_id.user.last_name}
										</div>
									)}
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
