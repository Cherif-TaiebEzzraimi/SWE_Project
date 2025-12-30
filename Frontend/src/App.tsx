
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { UserTypeProvider } from './context/UserTypeContext';
import './styles/App.css';
import LandingPage from './pages/landing_page/LandingPage';
import Header from "./../src/pages/landing_page/components/Header";
import AboutUs from "./../src/pages/landing_page/components/AboutUs";
import ProjectProgressPage from './pages/project_progress/ProjectProgressPage.tsx';
import Dashboard from './pages/landing_page/components/Dashboard.tsx';
import FreelancerDashboard from './pages/landing_page/components/FreelancerDashboard.tsx';
import FreelancersPage from './pages/landing_page/components/FreelancersPage.tsx';
import AddPostPage from './pages/landing_page/components/addPost.tsx';
import { PostsProvider } from './context/PostsContext.tsx';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProjectProgressClientOverview from './pages/project_progress/project_progress_overview/ProjectProgressClientOverview'
import ProjectProgressFreelancerOverview from './pages/project_progress/project_progress_overview/ProjectProgressFreelancerOverview'
import ProjectProgressPhasesAndTasks from './pages/project_progress/project_progress_overview/ProjectProgressPhasesAndTasks'
import './styles/App.css'



// function App() {
//   return (
//     <UserTypeProvider>
//       <PostsProvider>
//         <BrowserRouter>
//           <Routes>
//             {/* Landing/Home Page */}
//             <Route path="/" element={<LandingPage />} />
//             {/* About Us Page */}
//             <Route path="/about-us" element={<AboutUs />} />
//             {/* Jobs/Dashboard Page */}
//             <Route path="/dashboard" element={<MainAppSections section="client-dashboard" />} />
//             {/* Freelancers Browse Page */}
//             <Route path="/freelancersPage" element={<FreelancersPage />} />
//             {/* Project Progress Page */}
//             <Route path="/project-progress" element={<MainAppSections section="project-progress" />} />
//             {/* Client Dashboard with nested routes */}
//             <Route path="/client-dashboard/*" element={<MainAppSections section="client-dashboard" />} />
//             {/* Freelancer Dashboard */}
//             <Route path="/freelancer-dashboard" element={<MainAppSections section="freelancer-dashboard" />} />
//           </Routes>
//         </BrowserRouter>
//       </PostsProvider>
//     </UserTypeProvider>
//   );
//     <Router>
//       <div className="app">
//         <Routes>
//           {/* Default Route */}
//           <Route path="/" element={<ProjectProgressClientOverview />} />

//           {/* Client Routes  */}
//           <Route path="/project/:projectId/client/overview/upload" element={<ProjectProgressClientOverview />} />
//           <Route path="/project/:projectId/client/overview/submitted" element={<ProjectProgressClientOverview />} />
//           <Route path="/project/:projectId/client/phases" element={<ProjectProgressPhasesAndTasks />} />

//           {/* Freelancer Routes */}
//           <Route path="/project/:projectId/freelancer/overview/pending" element={<ProjectProgressFreelancerOverview />} />
//           <Route path="/project/:projectId/freelancer/overview/active" element={<ProjectProgressFreelancerOverview />} />
//           <Route path="/project/:projectId/freelancer/phases" element={<ProjectProgressPhasesAndTasks />} />

//           {/*  will be removed later */}
//           <Route path="/client/project-overview" element={<ProjectProgressClientOverview />} />
//           <Route path="/freelancer/project-overview" element={<ProjectProgressFreelancerOverview />} />
//           <Route path="/freelancer/project-overview/unlocked" element={<ProjectProgressFreelancerOverview />} />

//           {/*  testing  */}
//           <Route path="/project/:projectId/client/upload" element={<ProjectProgressClientOverview />} />
//           <Route path="/project/:projectId/client/submitted" element={<ProjectProgressClientOverview />} />
//           <Route path="/project/:projectId/freelancer/pending" element={<ProjectProgressFreelancerOverview />} />
//           <Route path="/project/:projectId/freelancer/active" element={<ProjectProgressFreelancerOverview />} />
//           <Route path="/project/:projectId/phases" element={<ProjectProgressPhasesAndTasks />} />
//         </Routes>
//       </div>
//     </Router>
//   )
// }

function App() {
  return (
    <UserTypeProvider>
      <PostsProvider>
        <BrowserRouter>
          <Routes>

            {/* Landing */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/freelancersPage" element={<FreelancersPage />} />

            {/* Dashboards */}
            <Route path="/client-dashboard/*" element={<MainAppSections section="client-dashboard" />} />
            <Route path="/freelancer-dashboard" element={<MainAppSections section="freelancer-dashboard" />} />

            {/* Project Progress main page */}
            <Route path="/project-progress" element={<MainAppSections section="project-progress" />} />

            {/* ================= PROJECT OVERVIEW ROUTES ================= */}

            {/* Client overview */}
            <Route
              path="/project/:projectId/client/overview/:status"
              element={<ProjectProgressClientOverview />}
            />

            {/* Freelancer overview */}
            <Route
              path="/project/:projectId/freelancer/overview/:status"
              element={<ProjectProgressFreelancerOverview />}
            />

            {/* Phases & Tasks (shared) */}
            <Route
              path="/project/:projectId/phases"
              element={<ProjectProgressPhasesAndTasks />}
            />

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