import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  
  // Store individual field errors
  const [emailError, setEmailError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalMessage, setGeneralMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset messages
    setEmailError("");
    setDisplayNameError("");
    setPasswordError("");
    setGeneralMessage("");

    try {
      const response = await axios.post("http://localhost:8000/register", {
        email,
        display_name: displayName,
        password,
      });

      setGeneralMessage(`Registered successfully! Welcome, ${response.data.display_name}`);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;

        if (status === 422) {
          // Pydantic validation error
          const details = error.response.data?.detail;
          if (Array.isArray(details)) {
            details.forEach((d: any) => {
              const field = d.loc?.[1]; // 'password', 'email', or 'display_name'
              if (field === "password") setPasswordError("Password must be between 8 and 64 characters");
              if (field === "email") setEmailError("Invalid email format");
              if (field === "display_name") setDisplayNameError("Display name is invalid");
            });
          } else {
            setGeneralMessage("Invalid input");
          }
        } else if (status === 400) {
          // Business/backend errors
          setGeneralMessage(error.response.data.detail || "Registration failed");
        } else {
          setGeneralMessage("An unexpected error occurred");
        }
      } else {
        setGeneralMessage("Registration failed. Try again later.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl mb-4">Register</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
          {emailError && <p className="text-red-500 mt-1">{emailError}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
          {displayNameError && <p className="text-red-500 mt-1">{displayNameError}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
          {passwordError && <p className="text-red-500 mt-1">{passwordError}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>

      {generalMessage && <p className="mt-4 text-red-500">{generalMessage}</p>}
    </div>
  );
};

export default RegisterPage;
