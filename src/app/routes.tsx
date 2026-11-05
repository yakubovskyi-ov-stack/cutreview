import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { PageLoader } from '@/components/PageLoader';

const LandingPage = lazy(() => import('@/features/landing/LandingPage'));
const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const ReviewPage = lazy(() => import('@/features/review/ReviewPage'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));
const NotFoundPage = lazy(() => import('@/features/errors/NotFoundPage'));

/** HashRouter: GitHub Pages has no server-side redirects. */
export function AppRouter() {
  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/project/:id" element={<ReviewPage />} />
          <Route path="/r/:token" element={<ReviewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}