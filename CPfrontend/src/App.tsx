import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BookingsPage from "./pages/BookingsPage";
import UpdateMePage from "./pages/UpdateMePage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      {/* Pages WITH global layout */}
      <Route
        path="/"
        element={
          <AppLayout>
            <LandingPage />
          </AppLayout>
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

