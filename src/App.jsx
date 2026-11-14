import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/ToastContext';

// Pages
import LandingPage from './pages/LandingPage';
import DesignShowcase from './pages/DesignShowcase';
import SchoolPublicPage from './pages/SchoolPublicPage';
import SchoolLogin from './pages/SchoolLogin';
import OwnerPanel from './pages/owner/OwnerPanel';

// Admin Layout & Modules
import AdminLayout from './pages/admin/AdminLayout';
import DashboardOverview from './pages/admin/modules/DashboardOverview';
import StudentManager from './pages/admin/modules/StudentManager';
import AdmissionManager from './pages/admin/modules/AdmissionManager';
import ResultManager from './pages/admin/modules/ResultManager';
import FeeManager from './pages/admin/modules/FeeManager';
import TeacherManager from './pages/admin/modules/TeacherManager';
import NoticeManager from './pages/admin/modules/NoticeManager';
import CmsManager from './pages/admin/modules/CmsManager';
import UserManager from './pages/admin/modules/UserManager';

/**
 * Helper component to scroll window to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <Routes>
            {/* 1. Platform Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* 2. Visual Design System Showcase */}
            <Route path="/design" element={<DesignShowcase />} />

            {/* 3. Platform Owner Portal (Indigo Enforced) */}
            <Route path="/owner" element={<OwnerPanel />} />

            {/* 4. Individual School Login Screen */}
            <Route path="/:slug/login" element={<SchoolLogin />} />

            {/* 5. School Admin Portal (8 Nested Modules) */}
            <Route path="/:slug/admin" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="students" element={<StudentManager />} />
              <Route path="admissions" element={<AdmissionManager />} />
              <Route path="results" element={<ResultManager />} />
              <Route path="fees" element={<FeeManager />} />
              <Route path="teachers" element={<TeacherManager />} />
              <Route path="notices" element={<NoticeManager />} />
              <Route path="cms" element={<CmsManager />} />
              <Route path="users" element={<UserManager />} />
              <Route path="settings" element={<CmsManager />} />
            </Route>

            {/* 6. Individual School Public Portal (Root slug must come after specific routes) */}
            <Route path="/:slug" element={<SchoolPublicPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
