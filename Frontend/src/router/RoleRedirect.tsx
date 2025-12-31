import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole, isAuthenticated } from '../lib/auth';

const RoleRedirect: React.FC = () => {
	const role = getRole();

	if (!isAuthenticated() || !role) {
		return <Navigate to="/login" replace />;
	}

	if (role === 'freelancer') {
		return <Navigate to="/freelancer/dashboard" replace />;
	}

	if (role === 'client') {
		return <Navigate to="/client/individual/dashboard" replace />;
	}

	if (role === 'company') {
		return <Navigate to="/client/company/dashboard" replace />;
	}

	if (role === 'admin') {
		return <Navigate to="/admin/dashboard" replace />;
	}

	return <Navigate to="/login" replace />;
};

export default RoleRedirect;
