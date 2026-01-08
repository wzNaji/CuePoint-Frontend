/**
 * App.tsx
 *
 * Defines the main routes for the React application using React Router v6.
 * 
 * Wraps pages that require the global layout (`AppLayout`) and defines
 * the landing page without a layout.
 *
 * Routes:
 * - "/"                  → LandingPage (no layout)
 * - "/login"             → LoginPage (with AppLayout)
 * - "/register"          → RegisterPage (with AppLayout)
 * - "/dashboard"         → DashboardPage (with AppLayout)
 * - "/users/:userId/bookings" → BookingsPage (with AppLayout)
 * - "/me/update"         → UpdateMePage (with AppLayout)
 * - "/profiles/:userId"  → ProfilePage (with AppLayout)
 */
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BookingsPage from "./pages/BookingsPage";
import UpdateMePage from "./pages/UpdateMePage";
import ProfilePage from "./pages/ProfilePage";

/**
 * App component
 *
 * Returns the main <Routes> tree for the application.
 *
 * @returns JSX.Element
 */

function App() {
  return (
    <Routes>
      {/* Pages WITH global layout */}
      <Route
        path="/"
        element={
            <LandingPage />
        }
      />
      <Route
        path="/login"
        element={
          <AppLayout>
            <LoginPage />
          </AppLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AppLayout>
            <RegisterPage />
          </AppLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        }
      />

      <Route
        path="/users/:userId/bookings"
        element={
          <AppLayout>
            <BookingsPage />
          </AppLayout>
        }
      />

      <Route
        path="/me/update"
        element={
          <AppLayout>
            <UpdateMePage />
          </AppLayout>
        }
      />

      <Route
        path="/profiles/:userId"
        element={
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;

