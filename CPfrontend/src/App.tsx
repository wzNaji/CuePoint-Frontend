import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UpdateMePage from "./pages/UpdateMePage";
import BookingsPage from "./pages/BookingsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users/:userId/bookings" element={<BookingsPage />} />
      <Route path="/me/update" element={<UpdateMePage />} />
    </Routes>
  );
}

export default App;
