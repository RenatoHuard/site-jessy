
import React, { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import SobrePage from './pages/SobrePage.jsx';
import ContatoPage from './pages/ContatoPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import MembersDashboard from './pages/members/MembersDashboard.jsx';
import MembersProfile from './pages/members/MembersProfile.jsx';
import { Toaster } from '@/components/ui/sonner';
import { UpdateBanner } from './components/UpdateBanner.jsx';
import {
  useInitializeDatabase,
  useExtractSobreContent,
  useExtractServicesContent,
  useExtractContatoContent,
  useExtractSiteConfig,
} from '@/hooks/useDatabaseSync.js';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminHomePage from './pages/admin/AdminHomePage.jsx';
import AdminServicesPage from './pages/admin/AdminServicesPage.jsx';
import AdminSobrePage from './pages/admin/AdminSobrePage.jsx';
import AdminContatoPage from './pages/admin/AdminContatoPage.jsx';
import AdminConfigPage from './pages/admin/AdminConfigPage.jsx';

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
        <AdminAutoSync />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/servicos" element={<MainLayout><ServicesPage /></MainLayout>} />
          <Route path="/sobre" element={<MainLayout><SobrePage /></MainLayout>} />
          <Route path="/contato" element={<MainLayout><ContatoPage /></MainLayout>} />
          
          {/* Auth Routes */}
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
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
