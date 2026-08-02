import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { SkipLink } from '@/components/ui/SkipLink'
import { RouteFocusHandler } from '@/components/ui/RouteFocusHandler'
import { ROUTES } from '@/constants/routes'
const PublicLayout = lazy(() => import('@/layouts/PublicLayout').then(m => ({ default: m.PublicLayout })))

const HomePage = lazy(() => import('@/features/home/pages/HomePage'))
const TrekListingPage = lazy(() => import('@/features/treks/pages/TrekListingPage'))
const TrekDetailPage = lazy(() => import('@/features/treks/pages/TrekDetailPage'))
const BookingPage = lazy(() => import('@/features/booking/pages/BookingPage').then(m => ({ default: m.BookingPage })))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const OAuth2Callback = lazy(() => import('@/features/auth/pages/OAuth2Callback'))
const AboutPage = lazy(() => import('@/features/home/pages/AboutPage'))
const ContactPage = lazy(() => import('@/features/home/pages/ContactPage'))
const UpcomingBatchesPage = lazy(() => import('@/features/treks/pages/UpcomingBatchesPage'))

// Protected Profile routes
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { ProfileLayout } from '@/features/profile/layouts/ProfileLayout'
import { ProfileDashboardPage } from '@/features/profile/pages/ProfileDashboardPage'
import { MyBookingsPage } from '@/features/profile/pages/MyBookingsPage'
import { MyProfilePage } from '@/features/profile/pages/MyProfilePage'
import { WishlistPage } from '@/features/profile/pages/WishlistPage'
import { SettingsPage } from '@/features/profile/pages/SettingsPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'

import { AdminLayout } from '@/features/admin/layouts/AdminLayout'
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage'
import { AdminProfilePage } from '@/features/admin/pages/AdminProfilePage'
import { AdminTreksPage } from '@/features/admin/pages/AdminTreksPage'
import { AdminTrekFormPage } from '@/features/admin/pages/AdminTrekFormPage'
import { AdminBookingsPage } from '@/features/admin/pages/AdminBookingsPage';
import AdminPaymentsPage from '@/features/admin/pages/AdminPaymentsPage';
import AdminUsersPage from '@/features/admin/pages/AdminUsersPage';
import AdminCouponsPage from '@/features/admin/pages/AdminCouponsPage';
import AdminReviewsPage from '@/features/admin/pages/AdminReviewsPage';
import AdminBlogsPage from '@/features/admin/pages/AdminBlogsPage';
import AdminBlogFormPage from '@/features/admin/pages/AdminBlogFormPage';
import AdminSettingsPage from '@/features/admin/pages/AdminSettingsPage';

// Minimal loading fallback — replaced with skeleton later
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-[#1F4D3A] border-t-transparent animate-spin" />
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <RouteFocusHandler />
      <SkipLink />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* ── Public routes ───────────────────────────────────────────── */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          
          {/* ── Public Layout Routes ──────────────────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<LoginPage />} />

            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.TREKS} element={<TrekListingPage />} />
            <Route path={ROUTES.TREK_DETAIL} element={<TrekDetailPage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
            <Route path={ROUTES.CONTACT} element={<ContactPage />} />
            <Route path={ROUTES.BATCHES} element={<UpcomingBatchesPage />} />
            
            {/* Booking flow is technically public to view, but requires login to complete payment */}
            <Route path="/book/:trekId" element={<BookingPage />} />
            
            {/* ── Protected User Routes ─────────────────────────────────────── */}
            <Route element={<ProtectedRoute guard="authenticated" />}>
              <Route element={<ProfileLayout />}>
                <Route path={ROUTES.PROFILE} element={<ProfileDashboardPage />} />
                {/* Other profile pages will go here, currently pointing to dashboard as placeholder */}
                <Route path="/bookings" element={<MyBookingsPage />} />
                <Route path="/upcoming-treks" element={<MyBookingsPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/payments" element={<ProfileDashboardPage />} />
                <Route path="/certificates" element={<ProfileDashboardPage />} />
                <Route path="/my-profile" element={<MyProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* ── Protected Admin Routes ─────────────────────────────────────── */}
            <Route element={<ProtectedRoute guard="admin" />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/treks" element={<AdminTreksPage />} />
                <Route path="/admin/treks/new" element={<AdminTrekFormPage />} />
                <Route path="/admin/treks/:id/edit" element={<AdminTrekFormPage />} />
                <Route path="/admin/bookings" element={<AdminBookingsPage />} />
                <Route path="/admin/payments" element={<AdminPaymentsPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/coupons" element={<AdminCouponsPage />} />
                <Route path="/admin/reviews" element={<AdminReviewsPage />} />
                <Route path="/admin/blogs" element={<AdminBlogsPage />} />
                <Route path="/admin/blogs/new" element={<AdminBlogFormPage />} />
                <Route path="/admin/blogs/:id/edit" element={<AdminBlogFormPage />} />
                <Route path="/admin/reports" element={<AdminDashboardPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
                <Route path="/admin/profile" element={<AdminProfilePage />} />
              </Route>
            </Route>

            {/* Catch-all routes render HomePage with Navbar */}
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  </BrowserRouter>
)
}
