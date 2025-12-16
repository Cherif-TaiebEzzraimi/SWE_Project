
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { UserTypeProvider } from './context/UserTypeContext';
import './styles/App.css';
import LandingPage from './pages/landing_page/LandingPage';
import Header from "./pages/landing_page/components/Header";
import AboutUs from "./pages/landing_page/components/AboutUs";
import ProjectProgressPage from './pages/project_progress/ProjectProgressPage.tsx';
import Dashboard from './pages/landing_page/components/Dashboard.tsx';
import FreelancerDashboard from './pages/landing_page/components/FreelancerDashboard.tsx';
import FreelancersPage from './pages/landing_page/components/FreelancersPage.tsx';
import AddPostPage from './pages/landing_page/components/addPost.tsx';
import { PostsProvider } from './context/PostsContext.tsx';

// Importing authentication pages
import Login from './pages/authentication/Login';
import ForgotPassword from './pages/authentication/ForgotPassword';
import ResetPassword from './pages/authentication/ResetPassword';
import SelectRole from './pages/authentication/SelectRole';
import ClientTypeSelection from './pages/authentication/ClientTypeSelection';
import SignupFreelancer from './pages/authentication/SignupFreelancer';
import SignupClientIndividual from './pages/authentication/SignupClientIndividual';
import SignupClientCompany from './pages/authentication/SignupClientCompany';
import FreelancerProfile from './pages/profile/FreelancerProfile';
import ClientIndividualProfile from './pages/profile/ClientIndividualProfile';
import ClientCompanyProfile from './pages/profile/ClientCompanyProfile';

function App() {
  return (
    <UserTypeProvider>
      <PostsProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing/Home Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/signup" element={<SelectRole />} />
            <Route path="/signup/client-type" element={<ClientTypeSelection />} />
            <Route path="/signup/freelancer" element={<SignupFreelancer />} />
            <Route path="/signup/client/individual" element={<SignupClientIndividual />} />
            <Route path="/signup/client/company" element={<SignupClientCompany />} />
            
            {/* Profile Routes */}
            <Route path="/profile/freelancer/:id" element={<FreelancerProfile />} />
            <Route path="/profile/client/:id" element={<ClientIndividualProfile />} />
            <Route path="/profile/company/:id" element={<ClientCompanyProfile />} />
            
            {/* About Us Page */}
            <Route path="/about-us" element={<AboutUs />} />
            
            {/* Freelancers Browse Page */}
            <Route path="/freelancersPage" element={<FreelancersPage />} />
            
            {/* Jobs/Dashboard Page */}
            <Route path="/dashboard" element={<MainAppSections section="client-dashboard" />} />
            
            {/* Project Progress Page */}
            <Route path="/project-progress" element={<MainAppSections section="project-progress" />} />
            
            {/* Client Dashboard with nested routes */}
            <Route path="/client-dashboard/*" element={<MainAppSections section="client-dashboard" />} />
            
            {/* Freelancer Dashboard */}
            <Route path="/freelancer-dashboard" element={<MainAppSections section="freelancer-dashboard" />} />
            
            {/* Admin Dashboard placeholder */}
            <Route path="/admin/dashboard" element={<div>Admin Dashboard (To be implemented)</div>} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PostsProvider>
    </UserTypeProvider>
  );
}

import { Routes as NestedRoutes, Route as NestedRoute } from 'react-router-dom';

function MainAppSections({ section }: { section: 'project-progress' | 'client-dashboard' | 'freelancer-dashboard' }) {
  const navigate = useNavigate();
  let content = null;

  if (section === 'project-progress') {
    content = <ProjectProgressPage />;
  } else if (section === 'client-dashboard') {
    // Nested routing for addPost under client-dashboard
    content = (
      <NestedRoutes>
        <NestedRoute index element={<Dashboard />} />
        <NestedRoute path="addPost" element={<AddPostPage />} />
      </NestedRoutes>
    );
  } else if (section === 'freelancer-dashboard') {
    content = <FreelancerDashboard />;
  }

  return (
    <div className="app min-h-screen bg-background-light dark:bg-background-dark">
      <Header
        {...({
          section,
          onSectionChange: (s: string) => {
            if (s === 'project-progress') navigate('/project-progress');
            else if (s === 'client-dashboard') navigate('/client-dashboard');
            else if (s === 'freelancer-dashboard') navigate('/freelancer-dashboard');
          },
        } as any)}
      />
      <main>
        {content}
      </main>
    </div>
  );
}

export default App;