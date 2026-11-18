
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import { Toaster } from '@/components/ui/sonner';
import { UpdateBanner } from './components/UpdateBanner.jsx';
import {
  useInitializeDatabase,
  useExtractSobreContent,
  useExtractServicesContent,
  useExtractContatoContent,
  useExtractSiteConfig,
} from '@/hooks/useDatabaseSync.js';

// Lazy-loaded public pages
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const SobrePage = lazy(() => import('./pages/SobrePage.jsx'));
const ContatoPage = lazy(() => import('./pages/ContatoPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const CommunityPage = lazy(() => import('./pages/CommunityPage.jsx'));

// Lazy-loaded member pages
const MembersDashboard = lazy(() => import('./pages/members/MembersDashboard.jsx'));
const MembersProfile = lazy(() => import('./pages/members/MembersProfile.jsx'));

// Lazy-loaded admin pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminHomePage = lazy(() => import('./pages/admin/AdminHomePage.jsx'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage.jsx'));
const AdminSobrePage = lazy(() => import('./pages/admin/AdminSobrePage.jsx'));
const AdminContatoPage = lazy(() => import('./pages/admin/AdminContatoPage.jsx'));
const AdminConfigPage = lazy(() => import('./pages/admin/AdminConfigPage.jsx'));

const AuthRedirectHandler = () => {
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    if (params.get('type') === 'recovery' && params.get('access_token')) {
      window.location.replace('/reset-password' + window.location.hash);
    }
  }, []);
  return null;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-primary/20 mb-4"></div>
      <div className="text-muted-foreground font-medium">Carregando...</div>
    </div>
  </div>
);

const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <UpdateBanner />
    <Header />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

const AdminAutoSync = () => {
  const { currentUser } = useAuth();
  const { sync: syncHome } = useInitializeDatabase();
  const { sync: syncSobre } = useExtractSobreContent();
  const { sync: syncServices } = useExtractServicesContent();
  const { sync: syncContato } = useExtractContatoContent();
  const { sync: syncConfig } = useExtractSiteConfig();
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'admin' && !hasRun) {
      setHasRun(true);
      const runSync = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/site_config?select=id&limit=1`,
            { headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY } }
          );
          const data = await res.json();
          if (!data || data.length === 0) {
            console.log('First admin login detected. Auto-syncing database...');
            await syncHome();
            await syncSobre();
            await syncServices();
            await syncContato();
            await syncConfig();
            console.log('Database sync complete.');
          }
        } catch (e) {
          console.error('Auto-sync error:', e);
        }
      };
      runSync();
    }
  }, [currentUser, hasRun]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AuthRedirectHandler />
        <AdminAutoSync />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/servicos" element={<MainLayout><ServicesPage /></MainLayout>} />
            <Route path="/sobre" element={<MainLayout><SobrePage /></MainLayout>} />
            <Route path="/contato" element={<MainLayout><ContatoPage /></MainLayout>} />

            {/* Auth Routes */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
            <Route path="/register" element={<MainLayout><SignupPage /></MainLayout>} />
            <Route path="/signup" element={<Navigate to="/register" replace />} />

            {/* Protected Member Routes */}
            <Route path="/members/dashboard" element={
              <ProtectedRoute requireMember={true}>
                <MainLayout><MembersDashboard /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/members/profile" element={
              <ProtectedRoute requireMember={true}>
                <MainLayout><MembersProfile /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Legacy Protected Routes */}
            <Route path="/profile" element={<Navigate to="/members/profile" replace />} />
            <Route path="/community" element={<Navigate to="/members/dashboard" replace />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="home" element={<AdminHomePage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="sobre" element={<AdminSobrePage />} />
              <Route path="contato" element={<AdminContatoPage />} />
              <Route path="config" element={<AdminConfigPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
