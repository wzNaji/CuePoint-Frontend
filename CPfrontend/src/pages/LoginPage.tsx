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
      // 🔥 Send form as application/x-www-form-urlencoded via cookie-enabled axios
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
      setEmail("");
      setPassword("");

      // Redirect after 1 second (optional)
      setTimeout(() => {
        navigate("/dashboard"); // Landing page will now detect user via cookie
      }, 1000);

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(`Error: ${error.response.data.detail}`);
      } else {
        setMessage("Login failed. Try again later.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl mb-4">Login</h1>
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
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default LoginPage;
