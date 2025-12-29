import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../api/auth";
import FormField from "../components/FormField";
import Message from "../components/Message";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    try {
      await loginUser(email, password);

      setMessage("Login successful!");
      setSuccess(true);

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

  return (
    <div className="flex justify-center py-20">
      <div className="w-full max-w-md p-6 bg-white border rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <FormField type="email" placeholder="Email" value={email} onChange={setEmail} />
          <FormField type="password" placeholder="Password" value={password} onChange={setPassword} />

          <button
            type="submit"
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Login
          </button>
        </form>

        {message && <Message text={message} success={success} />}
      </div>
    </div>
  );
};

export default LoginPage;
