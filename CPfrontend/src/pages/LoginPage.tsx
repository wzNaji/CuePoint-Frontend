/**
 * LoginPage.tsx
 *
 * Page for user login.
 *
 * Features:
 * - Collects email and password
 * - Handles authentication via API
 * - Displays success or error messages
 * - Redirects to dashboard on successful login
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../api/auth";
import FormField from "../components/FormField";
import Message from "../components/Message";
import Card from "../components/Card";
import Button from "../components/button";

/**
 * LoginPage Component
 *
 * Renders login form and handles user authentication.
 *
 * @returns JSX.Element
 */
const LoginPage = () => {
  // ------------------------------
  // Form state
  // ------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ------------------------------
  // UI messages
  // ------------------------------
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  /**
   * Handle user login
   *
   * @param e - Form submission event
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    try {
      await loginUser(email, password);

      setMessage("Login successful!");
      setSuccess(true);

      // Redirect to dashboard shortly after successful login
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (error: unknown) {
      setSuccess(false);

      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.detail || "Login failed");
      } else {
        setMessage("Login failed. Try again later.");
      }
    }
  };

  // ================= UI =================
  return (
    <div className="flex justify-center items-start py-20 min-h-screen bg-gray-900">
      <Card className="w-full max-w-md p-6 bg-gray-800 border-gray-700 text-white">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <FormField
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
          />
          <FormField
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />

          <Button
            type="submit"
            variant="secondary"
            size="md"
            className=""
          >
            Login
          </Button>
        </form>

        {message && (
          <div className="mt-4">
            <Message text={message} success={success} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
