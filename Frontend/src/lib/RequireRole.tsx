import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole, isAuthenticated } from './auth';

type RequireRoleProps = {
  role: string | string[];
  children: React.ReactNode;
};

const RequireRole: React.FC<RequireRoleProps> = ({ role, children }) => {
  const savedRole = getRole();
  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!isAuthenticated() || !savedRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(savedRole)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
