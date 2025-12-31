import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/authentication/Login';
import ForgotPassword from '../pages/authentication/ForgotPassword';
import ResetPassword from '../pages/authentication/ResetPassword';
import SelectRole from '../pages/authentication/SelectRole';
import ClientTypeSelection from '../pages/authentication/ClientTypeSelection';
import SignupFreelancer from '../pages/authentication/SignupFreelancer';
import SignupClientIndividual from '../pages/authentication/SignupClientIndividual';
import SignupClientCompany from '../pages/authentication/SignupClientCompany';
import VerifyEmail from '../pages/authentication/VerifyEmail';
import FreelancerProfile from '../pages/profile/FreelancerProfile';
import ClientIndividualProfile from '../pages/profile/ClientIndividualProfile';
import ClientCompanyProfile from '../pages/profile/ClientCompanyProfile';
import RequireRole from '../lib/RequireRole';
import RoleRedirect from './RoleRedirect';

const AppRouter = () => {
  return (
    <Routes>
      {/* Default redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/signup" element={<SelectRole />} />
      <Route path="/signup/client-type" element={<ClientTypeSelection />} />
      <Route path="/signup/freelancer" element={<SignupFreelancer />} />
      <Route path="/signup/client/individual" element={<SignupClientIndividual />} />
      <Route path="/signup/client/company" element={<SignupClientCompany />} />
      
      {/* Profile Routes */}
      <Route path="/profile/freelancer/:id" element={<FreelancerProfile />} />
      <Route path="/profile/client/:id" element={<ClientIndividualProfile />} />
      <Route path="/profile/company/:id" element={<ClientCompanyProfile />} />
      
      {/* Dashboard placeholders  */}
      <Route path="/dashboard" element={<RoleRedirect />} />

      <Route
        path="/freelancer/dashboard"
        element={
          <RequireRole role="freelancer">
            <div>Freelancer Dashboard (To be implemented)</div>
          </RequireRole>
        }
      />

      <Route
        path="/client/individual/dashboard"
        element={
          <RequireRole role="client">
            <div>Client Individual Dashboard (To be implemented)</div>
          </RequireRole>
        }
      />

      <Route
        path="/client/company/dashboard"
        element={
          <RequireRole role="company">
            <div>Client Company Dashboard (To be implemented)</div>
          </RequireRole>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <RequireRole role="admin">
            <div>Admin Dashboard (To be implemented)</div>
          </RequireRole>
        }
      />

      {/* Backward compat */}
      <Route path="/client/dashboard" element={<RoleRedirect />} />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;