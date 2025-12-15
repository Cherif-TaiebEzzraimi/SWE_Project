


import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import ProjectProgressPage from './pages/project_progress/ProjectProgressPage';
import Dashboard from './pages/Dashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import FreelancersPage from './pages/FreelancersPage';
import AddPostPage from './pages/addPost.tsx';
import Header from './components/Header';
import { PostsProvider } from './context/PostsContext';


function App() {
  // Single-page tab logic for main sections
  // Section state is now derived from the URL

  return (
    <PostsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainAppSections section="project-progress" />} />
          <Route path="/client-dashboard/*" element={<MainAppSections section="client-dashboard" />} />
          <Route path="/freelancer-dashboard" element={<MainAppSections section="freelancer-dashboard" />} />
          <Route path="/freelancers" element={<FreelancersPage />} />
        </Routes>
      </BrowserRouter>
    </PostsProvider>
  );
}

import { Routes as NestedRoutes, Route as NestedRoute } from 'react-router-dom';
function MainAppSections({ section }: { section: 'project-progress' | 'client-dashboard' | 'freelancer-dashboard' }) {
  const navigate = useNavigate();
  // removed unused location
  let content = null;
  if (section === 'project-progress') {
    content = <ProjectProgressPage />;
  } else if (section === 'client-dashboard') {
    // Nested routing for addPost under client-dashboard
    content = (
      <NestedRoutes>
  <NestedRoute path="/" element={<Dashboard />} />
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
            if (s === 'project-progress') navigate('/');
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

