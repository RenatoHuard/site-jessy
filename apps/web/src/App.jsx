
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
import ViewModeBanner from './components/ViewModeBanner.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import {
  useInitializeDatabase,
  useExtractSobreContent,
  useExtractServicesContent,
  useExtractContatoContent,
  useExtractSiteConfig,
} from '@/hooks/useDatabaseSync.js';
import { authGetSession } from '@/lib/authClient.js';
import supabase from '@/lib/supabaseClient.js';

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

// Lazy-loaded Respira Preta pages
const RespiraLayout = lazy(() => import('./components/respira/RespiraLayout.jsx'));
const RespiraHomePage = lazy(() => import('./pages/respira/RespiraHomePage.jsx'));
const RespiraSobrePage = lazy(() => import('./pages/respira/RespiraSobrePage.jsx'));
const RespiraEventosPage = lazy(() => import('./pages/respira/RespiraEventosPage.jsx'));
const RespiraEventoDetailPage = lazy(() => import('./pages/respira/RespiraEventoDetailPage.jsx'));

// Lazy-loaded admin pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminHomePage = lazy(() => import('./pages/admin/AdminHomePage.jsx'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage.jsx'));
const AdminSobrePage = lazy(() => import('./pages/admin/AdminSobrePage.jsx'));
const AdminContatoPage = lazy(() => import('./pages/admin/AdminContatoPage.jsx'));
const AdminConfigPage = lazy(() => import('./pages/admin/AdminConfigPage.jsx'));
const AdminRespiraPage = lazy(() => import('./pages/admin/AdminRespiraPage.jsx'));
const AdminRespiraHomePage = lazy(() => import('./pages/admin/AdminRespiraHomePage.jsx'));
const AdminRespiraSobrePage = lazy(() => import('./pages/admin/AdminRespiraSobrePage.jsx'));
const AdminRespiraConfigPage = lazy(() => import('./pages/admin/AdminRespiraConfigPage.jsx'));

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
    <ViewModeBanner />
    <Header />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
    <WhatsAppButton />
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
          // Passa o token do auth customizado para o Supabase SDK (necessário para writes via RLS)
          const sess = authGetSession();
          if (sess?.access_token) {
            await supabase.auth.setSession({
              access_token: sess.access_token,
              refresh_token: sess.refresh_token || '',
            });
          }

          const url = import.meta.env.VITE_SUPABASE_URL;
          const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
          const authHeader = sess?.access_token
            ? `Bearer ${sess.access_token}`
            : `Bearer ${anonKey}`;

          const isEmpty = async (table) => {
            try {
              const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, {
                headers: { apikey: anonKey, Authorization: authHeader },
              });
              const data = await res.json();
              return !Array.isArray(data) || data.length === 0;
            } catch { return true; }
          };

          if (await isEmpty('site_config')) await syncConfig();
          if (await isEmpty('homepage_content')) await syncHome();
          if (await isEmpty('services_content')) await syncServices();
          if (await isEmpty('sobre_content')) await syncSobre();
          if (await isEmpty('contato_content')) await syncContato();

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

            {/* Respira Preta Routes */}
            <Route path="/respira-preta" element={<RespiraLayout />}>
              <Route index element={<RespiraHomePage />} />
              <Route path="sobre" element={<RespiraSobrePage />} />
              <Route path="eventos" element={<RespiraEventosPage />} />
              <Route path="eventos/:id" element={<RespiraEventoDetailPage />} />
            </Route>

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
              <Route path="respira-home" element={<AdminRespiraHomePage />} />
              <Route path="respira-sobre" element={<AdminRespiraSobrePage />} />
              <Route path="respira" element={<AdminRespiraPage />} />
              <Route path="respira-config" element={<AdminRespiraConfigPage />} />
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
