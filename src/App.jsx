import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy-loaded Pages (Code-splitting for optimal loading speed & minimal bundle size)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DesignShowcase = lazy(() => import('./pages/DesignShowcase'));
const SchoolPublicPage = lazy(() => import('./pages/SchoolPublicPage'));
const SchoolLogin = lazy(() => import('./pages/SchoolLogin'));
const OwnerPanel = lazy(() => import('./pages/owner/OwnerPanel'));
const NotFound = lazy(() => import('./pages/NotFound'));
const DevSeedPage = lazy(() => import('./pages/dev/DevSeedPage'));

// Lazy-loaded Admin Layout & Child Modules
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const DashboardOverview = lazy(() => import('./pages/admin/modules/DashboardOverview'));
const StudentManager = lazy(() => import('./pages/admin/modules/StudentManager'));
const AdmissionManager = lazy(() => import('./pages/admin/modules/AdmissionManager'));
const ResultManager = lazy(() => import('./pages/admin/modules/ResultManager'));
const FeeManager = lazy(() => import('./pages/admin/modules/FeeManager'));
const TeacherManager = lazy(() => import('./pages/admin/modules/TeacherManager'));
const CommitteeManager = lazy(() => import('./pages/admin/modules/CommitteeManager'));
const RoutineManager = lazy(() => import('./pages/admin/modules/RoutineManager'));
const GalleryManager = lazy(() => import('./pages/admin/modules/GalleryManager'));
const NoticeManager = lazy(() => import('./pages/admin/modules/NoticeManager'));
const CmsManager = lazy(() => import('./pages/admin/modules/CmsManager'));
const UserManager = lazy(() => import('./pages/admin/modules/UserManager'));
const SchoolSettings = lazy(() => import('./pages/admin/modules/SchoolSettings'));

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
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ScrollToTop />
            <Suspense fallback={<LoadingSpinner fullScreen text="সহজ পাঠশালা প্রস্তুত হচ্ছে..." />}>
              <Routes>
                {/* 1. Platform Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* 2. Visual Design System Showcase */}
                <Route path="/design" element={<DesignShowcase />} />

                {/* 3. Platform Owner Portal (Indigo Enforced) */}
                <Route path="/owner" element={<OwnerPanel />} />
                <Route path="/owner/login" element={<Navigate to="/owner" replace />} />
                <Route path="/owner/*" element={<OwnerPanel />} />

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
                  <Route path="committee" element={<CommitteeManager />} />
                  <Route path="routines" element={<RoutineManager />} />
                  <Route path="gallery" element={<GalleryManager />} />
                  <Route path="notices" element={<NoticeManager />} />
                  <Route path="cms" element={<CmsManager />} />
                  <Route path="users" element={<UserManager />} />
                  <Route path="settings" element={<SchoolSettings />} />
                </Route>

                {/* 6. Individual School Public Portal */}
                <Route path="/:slug" element={<SchoolPublicPage />} />

                {/* 7. Dev-Only Seed Hub */}
                {import.meta.env.DEV && (
                  <Route path="/__dev/seed" element={<DevSeedPage />} />
                )}

                {/* 8. Dedicated 404 Not Found Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
