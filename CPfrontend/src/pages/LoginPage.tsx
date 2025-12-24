import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post(
        "/login",
        new URLSearchParams({
          username: email,
          password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.detail || "Login failed");
      } else {
        setMessage("Login failed. Try again later.");
      }
    }
  };

  return (
    <div className="flex justify-center py-20">
      <div className="w-full max-w-md p-6 bg-white border rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-red-500 text-center">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
