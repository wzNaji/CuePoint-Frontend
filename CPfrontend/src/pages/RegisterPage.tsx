import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const RegisterPage = () => {

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate();


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8000/register", {
        email,
        display_name: displayName,
        password,
      });

      setMessage(`Registered successfully! Welcome, ${response.data.display_name}`);

      // Delay redirect for 3 seconds
    setTimeout(() => {
        navigate("/login");
    }, 3000);

    } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
        setMessage(`Error: ${error.response.data.detail}`);
    } else if (error instanceof Error) {
        setMessage("Registration failed. Try again later.");
    }
    }  
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl mb-4">Register</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
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
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default RegisterPage;
